import prismaClient from "../../prisma";
import { TimeZoneConfig } from '../../config/timezone/TimeZone';

class ReadUserService {

  async execute() {

    const users = await prismaClient.user.findMany({
      
      select: {
        id: true,
        name: true,
        email: true,
        nivel: true,
        created_at: true,
        update_at: true,
      }
    });

    const Users = users.map(user => {
      return {
        ...user,
        created_at: TimeZoneConfig.timeZone(user.created_at),
        update_at: TimeZoneConfig.timeZone(user.update_at),
      };
    });

    return Users;

  }
}

export { ReadUserService };
