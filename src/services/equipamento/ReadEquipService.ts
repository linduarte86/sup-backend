
import prismaClient from "../../prisma";
import { TimeZoneConfig } from "../../config/timezone/TimeZone";

class ReadEquipService {

  async execute() {

    const equipamentos = await prismaClient.equipamento.findMany({

      select: {
        id: true,
        name: true,
        modelo: true,
        description: true,
        ip: true,
        port: true,
        ativo: true,
        created_at: true,
        update_at: true
      }
    });

    const Equipamentos = equipamentos.map(equip => {

      return {
        ...equip,
        created_at: TimeZoneConfig.timeZone(equip.created_at),
        update_at: TimeZoneConfig.timeZone(equip.update_at)
      };
    });

    return Equipamentos;
  }
}

export { ReadEquipService }