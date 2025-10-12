import prismaClient from "../../prisma";
import { TimeZoneConfig } from "../../config/timezone/TimeZone";

class ReadLogsService {

  async execute() {
    // Fetch logs from the database

    const logs = await prismaClient.logFalha.findMany({
      include: {
        equipamento: true,
        itens: true
      },
      orderBy: {
        created_at: "desc"
      }
    });

    const Logs = logs.map(log => {
      return {
        ...log,
        created_at: TimeZoneConfig.timeZone(log.created_at),
      
      };
    });

    return Logs;
  }
}

export { ReadLogsService };