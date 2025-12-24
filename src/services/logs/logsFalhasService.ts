import prismaClient from "../../prisma";
import { sendNotification } from "../../bullRedis/tasks/notification/notificationScheduler";
import { io } from "../../server";

async function LogsFalhasService(response, equipamento) {
  const { RESPOSTA } = response;

  // Busca o último registro de falha do equipamento
  const ultimoLog = await prismaClient.logFalha.findFirst({
    where: { equipamentoId: equipamento.id },
    orderBy: { created_at: "desc" },
    include: { itens: true },
  });

  // Monta o estado atual das falhas
  const falhasAmplificadoresAtuais = RESPOSTA.falhasAmplificadores.filter(f => f.includes("Falha"));
  const falhasLinhasAtuais = RESPOSTA.falhasLinhas.filter(f => f.includes("Alta") || f.includes("Baixa") || f.includes("Falha de aterramento"));
  const statusGeralAtual = RESPOSTA.statusGeral;
  const statusReservaAtual = RESPOSTA.statusReserva;

  // Monta o estado anterior das falhas
  let falhasAmplificadoresAnteriores = [];
  let falhasLinhasAnteriores = [];
  let statusGeralAnterior = "OK";
  let statusReservaAnterior = "OK";
  if (ultimoLog) {
    falhasAmplificadoresAnteriores = ultimoLog.itens.filter(i => i.tipo === "AMPLIFICADOR").map(i => i.descricao);
    falhasLinhasAnteriores = ultimoLog.itens.filter(i => i.tipo === "LINHA").map(i => i.descricao);
    // Extrai status do campo descricao do log anterior
    const matchGeral = ultimoLog.descricao.match(/Status geral: (.*?),/);
    const matchReserva = ultimoLog.descricao.match(/Reserva: (.*)$/);
    if (matchGeral) statusGeralAnterior = matchGeral[1];
    if (matchReserva) statusReservaAnterior = matchReserva[1];
  }

  // Verifica se houve mudança nas falhas ou status
  const mudouAmplificadores = JSON.stringify(falhasAmplificadoresAtuais) !== JSON.stringify(falhasAmplificadoresAnteriores);
  const mudouLinhas = JSON.stringify(falhasLinhasAtuais) !== JSON.stringify(falhasLinhasAnteriores);
  const mudouStatusGeral = statusGeralAtual !== statusGeralAnterior;
  const mudouStatusReserva = statusReservaAtual !== statusReservaAnterior;

  const temMudanca = mudouAmplificadores || mudouLinhas || mudouStatusGeral || mudouStatusReserva;

  if (!temMudanca) {
    // Não houve mudança, não registra nada
    return;
  }

  const temFalhas =
    falhasAmplificadoresAtuais.length > 0 ||
    falhasLinhasAtuais.length > 0 ||
    statusGeralAtual !== "OK" ||
    statusReservaAtual !== "OK";

  if (!temFalhas) {
    await prismaClient.logFalha.create({
      data: {
        equipamentoId: equipamento.id,
        descricao: "Todas as falhas restauradas — status geral OK",
      },
    });
    console.log(`Registrado evento de recuperação para ${equipamento.name}`);
    return;
  }

  // Cria o registro principal de falha
  const logFalha = await prismaClient.logFalha.create({
    data: {
      equipamentoId: equipamento.id,
      descricao: `Status geral: ${statusGeralAtual}, Reserva: ${statusReservaAtual}`,
    },
  });

  // Carrega zonas do equipamento para mapear número -> zonaId
  const zonasDoEquip = await prismaClient.zonas.findMany({ where: { equipamentoId: equipamento.id } });
  // mapa númeroCanal -> objeto zona
  const zonaMap = new Map<number, any>();
  zonasDoEquip.forEach(z => zonaMap.set(z.numeroCanal, z));

  // Processa falhas de amplificadores
  const amplificadorFalhas = falhasAmplificadoresAtuais
    .map((desc, idx) => {
      // tenta extrair número (ex: 'Amplificador 4: Falha' -> 4)
      const numMatch = desc.match(/(\d+)/);
      const numero = numMatch ? Number(numMatch[1]) : null;
      const zonaObj = numero ? zonaMap.get(numero) ?? null : null;
      const zonaId = zonaObj ? zonaObj.id : null;

      return {
        logId: logFalha.id,
        tipo: "AMPLIFICADOR",
        indice: idx + 1,
        descricao: desc,
        zonaId,
      };
    });

  // Processa falhas de linhas
  const linhaFalhas = falhasLinhasAtuais
    .map((desc, idx) => {
      // tenta extrair número (ex: 'Linha 8: Alta' -> 8)
      const numMatch = desc.match(/(\d+)/);
      const numero = numMatch ? Number(numMatch[1]) : null;
      const zonaObj = numero ? zonaMap.get(numero) ?? null : null;
      const zonaId = zonaObj ? zonaObj.id : null;

      return {
        logId: logFalha.id,
        tipo: "LINHA",
        indice: idx + 1,
        descricao: desc,
        zonaId,
      };
    });

  // Salva todos os itens de falha
  if (amplificadorFalhas.length || linhaFalhas.length) {
    await prismaClient.itemFalha.createMany({
      data: [...amplificadorFalhas, ...linhaFalhas],
    });
  }

  console.log(`Falhas registradas para ${equipamento.name}`);

  // Emite para todos os clientes conectados via Socket.io
  io.emit("novaFalha", {
    equipamentoId: equipamento.id,
    equipamentoDescricao: equipamento.description,
    log: {
      id: logFalha.id,
      descricao: logFalha.descricao,
      itens: [...amplificadorFalhas, ...linhaFalhas],
      created_at: logFalha.created_at,
    },
  });

  const tempoMensagem = await prismaClient.tempoEnvioMensagem.findFirst({
    select: { tempo: true }
  });

  // Dispara o envio da notificação de forma assíncrona, sem bloquear o job principal
  setTimeout(async () => {
    // Busca o último log de falha atualizado após o tempo
    const ultimoLogAtual = await prismaClient.logFalha.findFirst({
      where: { equipamentoId: equipamento.id },
      orderBy: { created_at: "desc" }
    });

    // Só envia notificação se o statusGeral ainda for diferente de OK
    if (ultimoLogAtual && !ultimoLogAtual.descricao.includes("Todas as falhas restauradas — status geral OK")) {
      // Formata cada falha prefixando com a zona (se encontrada)
      const amplificadorLinhas = falhasAmplificadoresAtuais.map(desc => {
        const m = desc.match(/(\d+)/);
        const numero = m ? Number(m[1]) : null;
        const zonaObj = numero ? zonaMap.get(numero) : null;
        const prefix = zonaObj ? zonaObj.name : (numero ? `CH${numero}` : "");
        return prefix ? `${prefix} - ${desc}` : desc;
      });

      const linhaLinhas = falhasLinhasAtuais.map(desc => {
        const m = desc.match(/(\d+)/);
        const numero = m ? Number(m[1]) : null;
        const zonaObj = numero ? zonaMap.get(numero) : null;
        const prefix = zonaObj ? zonaObj.name : (numero ? `CH${numero}` : "");
        return prefix ? `${prefix} - ${desc}` : desc;
      });

      const mensagem = `\nFalha detectada pelo o equipamento: ${equipamento.name}\n\nStatus geral: ${statusGeralAtual}\nStatus do amplificador reserva: ${statusReservaAtual}\n\nAmplificadores com falha:\n${amplificadorLinhas.length ? amplificadorLinhas.map(f => `- ${f}`).join("\n") : "Nenhum"}\n\nLinhas de sonofletores com falha:\n${linhaLinhas.length ? linhaLinhas.map(f => `- ${f}`).join("\n") : "Nenhuma"}\n`;
      await sendNotification(equipamento, mensagem);
    }
  }, tempoMensagem.tempo);

}

export { LogsFalhasService };
