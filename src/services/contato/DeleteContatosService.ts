import { error } from "console";
import prismaClient from "../../prisma";

interface ContatoRequest {
  contato_id: string,
}

class DeletecontatosService {

  async execute({contato_id}: ContatoRequest) {

    const contatoExist = prismaClient.contato.findUnique({
      where: { id: contato_id },
    });

    if (!contatoExist) {
      throw new error ("Contato não encontrado!");
    }

    const contato = await prismaClient.contato.delete({
      where: {id: contato_id},
    });

    return { message: "Contatos deletado com sucesso!"};
  }
}

export { DeletecontatosService };