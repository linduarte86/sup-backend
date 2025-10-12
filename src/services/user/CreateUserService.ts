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
      },
      select: {
        id: true,
        name: true,
        email: true,
        nivel: true,
        created_at: true,
      },
    });

    return {
      ...user, // ...user, permite alterar o created_at com o formattedDate
      created_at: TimeZoneConfig.timeZone(user.created_at)
    };
  }
}

export { CreateUserService }