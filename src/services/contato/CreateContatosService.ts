import prismaClient from "../../prisma";
import { TimeZoneConfig } from '../../config/timezone/TimeZone';
import { ContatoData } from "../../schemas/contatos/contatoSchema";

class CreateContatosService {
  async execute(data: ContatoData){

    //verificar se ele enviou um email
    if (!data.email) {
      throw new Error("Email incorrect");
    }

    //verificar se esse email já está cadastrado
    const contatoExist = await prismaClient.contato.findFirst({
      where: {
        email: data.email
      }
    })

    if (contatoExist) {
      throw new Error("Usuario existe");
    }

    const contato = await prismaClient.contato.create({

      data:{
        name:data.name,
        email:data.email,
        telefone:data.telefone,
        receberEmail:data.receberEmail,
        receberWhats:data.receberWhats
      },
      select:{
        id: true,
        name: true,
        email: true,
        telefone:true,
        receberEmail:true,
        receberWhats:true,
        created_at:true
      }
    });

    return {
      ...contato,
      created_at: TimeZoneConfig.timeZone(contato.created_at)
    };
  }
}

export { CreateContatosService };