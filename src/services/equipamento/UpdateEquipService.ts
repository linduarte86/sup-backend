import prismaClient from "../../prisma";
import { equipUpdateSchema, EquipUpdateData } from "../../schemas/equipamentos/equipSchema";
import { TimeZoneConfig } from "../../config/timezone/TimeZone";
import { supervisorQueue } from "../../bullRedis/queues/supervisor/supervisorQueues";
import { startEquipamentoTasks } from '../../bullRedis/tasks/supervisor/scheduler';

class UpdateEquipService {
  async execute(id: string, data: EquipUpdateData) {
    // Valida os dados (lança erro se inválido)
    equipUpdateSchema.parse(data);

    const updatedEquip = await prismaClient.equipamento.update({
      where: { id },
      data,
      select: {
        id: true,
        name: true,
        modelo: true,
        description: true,
        ip: true,
        port: true,
        ativo: true,
        created_at: true,
        update_at: true,
      },
    });
    
    // remover jobs repetíveis antigos
    const jobs = await supervisorQueue.getRepeatableJobs();
    for (const job of jobs) {
      if (job.id === id) {
        await supervisorQueue.removeRepeatableByKey(job.key);
      }
    }

    startEquipamentoTasks();// Reinicia o agendador de tarefas para verificar os equipamentos

    return {
      ...updatedEquip,
      created_at: TimeZoneConfig.timeZone(updatedEquip.created_at),
      update_at: TimeZoneConfig.timeZone(updatedEquip.update_at)
    };
  }
}

export { UpdateEquipService };
