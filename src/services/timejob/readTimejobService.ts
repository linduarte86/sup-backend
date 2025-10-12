import prismaClient from "../../prisma";
import { TimeZoneConfig } from "../../config/timezone/TimeZone";

class ReadTimejobService {

  async execute() {

    const timejobs = await prismaClient.timejob.findMany({
      select: {
        id: true,
        name: true,
        intervalo_ms: true,
        created_at: true,
        update_at: true
      }
    });

    const Timejobs = timejobs.map(timejob => {

      return {
        ...timejob,
        created_at: TimeZoneConfig.timeZone(timejob.created_at),
        update_at: TimeZoneConfig.timeZone(timejob.update_at)
      };
    });

    return Timejobs;
  }
}

export { ReadTimejobService };