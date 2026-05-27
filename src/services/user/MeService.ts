import prismaClient from "../../prisma";

class MeService {

  async execute(user_id: string) {

    const userId = await prismaClient.user.findUnique({
      where: {
        id: user_id
      },
      include: {
        permissions: {
          include: {
            permission: true
          }
        },
      }
    });

    return {
      id: userId?.id,
      name: userId?.name,
      email: userId?.email,
      nivel: userId?.nivel,

      permissions:
        userId?.permissions.map(
          item => item.permission.key
        ) || [],

      created_at: userId ? userId.created_at : null
    };
  }
}

export { MeService };