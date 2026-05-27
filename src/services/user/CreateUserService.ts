import prismaClient from '../../prisma'
import { hash } from 'bcryptjs';
import { TimeZoneConfig } from '../../config/timezone/TimeZone';
import { UserData } from '../../schemas/users/usersSchema';


class CreateUserService {
  async execute(data: UserData) {

    //verificar se ele enviou um email
    if (!data.email) {
      throw new Error("Email incorrect");
    }

    //verificar se esse email já está cadastrado
    const userAlreadyExist = await prismaClient.user.findFirst({
      where: {
        email: data.email
      }
    })

    if (userAlreadyExist) {
      throw new Error("Usuario existe");
    }

    const passwordHash = await hash(data.password, 8)

    const user = await prismaClient.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: passwordHash,
        nivel: data.nivel as any
      }
    });

    //Para obrigar operador ter pelo menos uma permissão
    if (
      data.nivel === 'OPERADOR' &&
      data.permissions &&
      data.permissions.length > 0
    ) {

      for (const permissionKey of data.permissions) {

        const permission =
          await prismaClient.permission.findUnique({
            where: {
              key: permissionKey
            }
          });

        if (permission) {

          await prismaClient.userPermission.create({
            data: {
              userId: user.id,
              permissionId: permission.id
            }
          });
        }
      }
    }

    // BUSCAR USUÁRIO COMPLETO

    const userComplete =
      await prismaClient.user.findUnique({
        where: {
          id: user.id
        },
        include: {
          permissions: {
            include: {
              permission: true
            }
          }
        }
      });

    // RETORNO

    return {
      id: userComplete?.id,
      name: userComplete?.name,
      email: userComplete?.email,
      nivel: userComplete?.nivel,

      permissions:
        userComplete?.permissions.map(
          item => item.permission.key
        ) || [],

      created_at: TimeZoneConfig.timeZone(
        userComplete!.created_at
      )
    };
  }
}

export { CreateUserService }