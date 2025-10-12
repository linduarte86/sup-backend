import { Prisma } from "@prisma/client";
import prismaClient from "../../prisma";
import { TimeZoneConfig } from '../../config/timezone/TimeZone';
import { startEquipamentoTasks } from '../../bullRedis/tasks/supervisor/scheduler';

class CreateEquipService {
  async execute(data: Prisma.EquipamentoCreateInput) {
    
    const equip = await prismaClient.equipamento.create({
      data
    });

    // Iniciar o agendador de tarefas para verificar os equipamentos
    startEquipamentoTasks();

    return {
      ...equip,
      created_at: TimeZoneConfig.timeZone(equip.created_at),
      update_at: TimeZoneConfig.timeZone(equip.update_at),
    }
  }
}

export { CreateEquipService };
