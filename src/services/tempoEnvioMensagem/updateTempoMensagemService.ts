import prismaClient from "../../prisma";
import { TimeZoneConfig } from "../../config/timezone/TimeZone";
import { tempoMensagemSchema, TempoMensagemUpdateData } from "../../schemas/tempoEnvioMensagem/tempoMensagemSchema";

// Atualiza o tempo de envio de mensagens
class UpdateTempoMensagemService {

  async execute(id: string, data: TempoMensagemUpdateData) {
    // Validar os dados de entrada
    tempoMensagemSchema.partial().parse(data);

    // Atualizar o registro no banco de dados
    const updatedTempoEnvioMensagem = await prismaClient.tempoEnvioMensagem.update({
      where: { id },
      data,
      select: {
        id: true,
        name: true,
        tempo: true,
        created_at: true,
        update_at: true
      }
    });

    return {
      ...updatedTempoEnvioMensagem,
      created_at: TimeZoneConfig.timeZone(updatedTempoEnvioMensagem.created_at),
      update_at: TimeZoneConfig.timeZone(updatedTempoEnvioMensagem.update_at)
    };
  }
}

export { UpdateTempoMensagemService };