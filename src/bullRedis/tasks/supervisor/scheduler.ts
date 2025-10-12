import prismaClient from "../../../prisma";
import { supervisorQueue } from "../../queues/supervisor/supervisorQueues";

/**
 * Configuração do agendador de tarefas
 * Utiliza Bull para agendar a verificação periódica dos equipamentos.
 */
export async function startEquipamentoTasks() {
  try {
    console.log("Iniciando agendador de tarefas...");
    // Buscar todos os equipamentos ativos no banco de dados
    const ativos = await prismaClient.equipamento.findMany({
      where: { ativo: true },
    });

    // Buscar o intervalo de tempo configurado para o job
    const timeJob = await prismaClient.timejob.findFirst({
      where: { name: "timejob" },
    });

    if (timeJob.intervalo_ms === 0) {
      console.error("Intervalo de tempo inválido.");
      return;
    }

    if (ativos.length === 0) {
      console.log("Nenhum equipamento ativo encontrado.");
      return;
    }

    // Buscar os jobs já agendados
    const repeatables = await supervisorQueue.getRepeatableJobs();

    for (const equipamento of ativos) {
      const jobId = equipamento.id;

      const jaExiste = repeatables.some(
        (job) =>
          job.id === jobId &&
          job.name === "verificar-equipamento" &&
          job.every === timeJob.intervalo_ms
      );

      if (jaExiste) {
        console.log(`Job já existe para o equipamento ${equipamento.name}.`);
        continue;
      }

      // Se existir com configuração diferente, remove
      await supervisorQueue.removeRepeatable("verificar-equipamento", {
        jobId,
        every: timeJob.intervalo_ms,
      });

      // Criar job
      await supervisorQueue.add(
        "verificar-equipamento",
        { equipamento },
        {
          jobId,
          repeat: { every: timeJob.intervalo_ms },
        }
      );

      console.log(`Job agendado para ${equipamento.name}`);
    }


    console.log(`Agendador de tarefas iniciado com sucesso para ${ativos.length} equipamentos ativos. ${timeJob.intervalo_ms}ms entre verificações.`);

  } catch (error) {
    console.error("Erro ao iniciar o agendador de tarefas:", error);
  }
};