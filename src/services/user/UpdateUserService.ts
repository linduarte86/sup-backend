import prismaClient from "../../prisma";
import { userUpdateSchema, UserUpdateData } from "../../schemas/users/userUpdateSchema";
import { compare, hash } from "bcryptjs";
import { TimeZoneConfig } from '../../config/timezone/TimeZone';

class UpdateUserService {

  async execute( id: string, data: UserUpdateData ){

    userUpdateSchema.parse(data);

    const user = await prismaClient.user.findUnique({
      where: { id: id },
    });

    if (!user) {
      throw new Error("Usuário não encontrado!");
    }

    //Verifica se a senha antiga está correta
    const passwordMatch = await compare(data.oldPassword, user.password);

    if (!passwordMatch) {
      throw new Error("Senha atual incorreta!");
    }

    const dataToUpdate: any = {};
    if (data.name) dataToUpdate.name = data.name;
    if (data.email) dataToUpdate.email = data.email;
    if (data.nivel) dataToUpdate.nivel = data.nivel;

    if (data.newPassword) {
     
      const hashedPassword = await hash(data.newPassword, 8);
      dataToUpdate.password = hashedPassword;

    }

    const updatedUser = await prismaClient.user.update({
      where: { id: id },
      data: dataToUpdate,
      select: {
        id: true,
        name: true,
        email: true,
        nivel: true,
        created_at: true,
        update_at: true,
      },
    });

    return {
      ...updatedUser, // ...user, permite alterar o created_at com o formattedDate
      created_at: TimeZoneConfig.timeZone(updatedUser.created_at),
      update_at: TimeZoneConfig.timeZone(updatedUser.update_at)
    };
  }
}

export { UpdateUserService };