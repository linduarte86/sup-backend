import prismaClient from "../../prisma";
import { TimeZoneConfig } from "../../config/timezone/TimeZone";

class ReadTempoMensagemService {

  async execute() {

    const tempoMensagem = await prismaClient.tempoEnvioMensagem.findMany({
      select: {
        id: true,
        name: true,
        tempo: true,
        created_at: true,
        update_at: true
      }
    });

    const TempoMensagem = tempoMensagem.map(TEMPO_Mensagem => {
      return {
        ...TEMPO_Mensagem,
        created_at: TimeZoneConfig.timeZone(TEMPO_Mensagem.created_at),
        update_at: TimeZoneConfig.timeZone(TEMPO_Mensagem.update_at)
      };
    });

    return TempoMensagem;
  }
}

export { ReadTempoMensagemService };