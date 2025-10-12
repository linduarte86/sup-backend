import prismaClient from "../../prisma";
import { ContatoUpdateData, contatoUpdateSchema } from "../../schemas/contatos/contatoSchema";
import { TimeZoneConfig } from "../../config/timezone/TimeZone";

class UpdateContatosService {

  async execute(id: string, data: ContatoUpdateData) {

    // Valida os dados (lança erro se inválido)
    contatoUpdateSchema.parse(data);

    const updateContato = await prismaClient.contato.update({
      where: { id },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        telefone: true,
        receberEmail:true,
        receberWhats: true,
        created_at: true,
        update_at: true
      }
    });

    return {
      ...updateContato,
      created_at: TimeZoneConfig.timeZone(updateContato.created_at),
      update_at: TimeZoneConfig.timeZone(updateContato.update_at)
    };
  }
}

export { UpdateContatosService };