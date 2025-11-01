import { Prisma } from "@prisma/client";
import prismaClient from "../../prisma";
import { TimeZoneConfig } from '../../config/timezone/TimeZone';
import { startEquipamentoTasks } from '../../bullRedis/tasks/supervisor/scheduler';

class CreateEquipService {
  async execute(data: Prisma.EquipamentoCreateInput) {
    
    // Cria o equipamento com 8 zonas (CH1 a CH8)
    const equip = await prismaClient.equipamento.create({
      data: {
        ...data,
        Zonas: {
          create: Array.from({ length: 8 }, (_, i) => ({
            numeroCanal: i + 1,
            name: `CH${i + 1}`,
          })),
        },
      },
      include: { Zonas: true }, // opcional: inclui as zonas no retorno
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
