import prismaClient from "../../prisma";

interface UserRequest {
  user_id: string
}

class DeleteUserService {
  async execute({ user_id }: UserRequest) {
    const userExists = await prismaClient.user.findUnique({
      where: { id: user_id },
    });

    if (!userExists) {
      throw new Error("Usuário não encontrado");
    }

    const user = await prismaClient.user.delete({
      where: { id: user_id },
    });

    return { message: "Usuário deletado com sucesso." };
  }
}

export { DeleteUserService };


