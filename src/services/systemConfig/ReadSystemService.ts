import prismaClient from "../../prisma";
import { TimeZoneConfig } from "../../config/timezone/TimeZone";

class ReadSystemService {

  async execute() {

    const systemConfigs = await prismaClient.systemConfig.findMany({
      select: {
        id: true,
        empresaName: true,
        logoUrl: true,
        email: true,
        telefone: true,
        endereco: true,
        created_at: true,
        update_at: true
      }
    });

    const SystemConfigs = systemConfigs.map(systemConfig => {

      return {
        ...systemConfig,
        created_at: TimeZoneConfig.timeZone(systemConfig.created_at),
        update_at: TimeZoneConfig.timeZone(systemConfig.update_at)
      };
    });

    return SystemConfigs;
  }
}

export { ReadSystemService };