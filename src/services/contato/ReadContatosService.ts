import prismaClient from "../../prisma";
import { TimeZoneConfig } from "../../config/timezone/TimeZone";

class ReadContatosService {
  
  async execute() {

    const contatos = await prismaClient.contato.findMany({

      select: {
        id: true,
        name: true,
        email: true,
        telefone: true,
        receberEmail: true,
        receberWhats: true,
        created_at: true,
        update_at: true
      }
    });

    const Contatos = contatos.map(contato => {

      return {
        ...contato,
        created_at: TimeZoneConfig.timeZone(contato.created_at),
        update_at: TimeZoneConfig.timeZone(contato.update_at)
      };
    });

    return Contatos;
  }
}

export { ReadContatosService };