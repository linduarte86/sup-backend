import prismaClient from "../../prisma";
import { TimeZoneConfig } from "../../config/timezone/TimeZone";
import { TimejobUpdateData, timejobUpdateSchema } from "../../schemas/timejob/timejobSchema";
import { startEquipamentoTasks } from '../../bullRedis/tasks/supervisor/scheduler';
import { supervisorQueue } from "../../bullRedis/queues/supervisor/supervisorQueues";

class UpdateTimejobService {

  async execute(id: string, data: TimejobUpdateData) {

    // Validar os dados de entrada
    timejobUpdateSchema.parse(data);

    // Atualizar o registro no banco de dados
    const updatedTimejob = await prismaClient.timejob.update({
      where: { id },
      data,
      select: {
        id: true,
        name: true,
        intervalo_ms: true,
        created_at: true,
        update_at: true
      }
    });

    const equipamentos = await prismaClient.equipamento.findMany({
      where: { ativo: true }
    });

    // Remover todos os jobs repetíveis antigos
    const jobs = await supervisorQueue.getRepeatableJobs();
    for (const job of jobs) {
      for (const equipamento of equipamentos) {
        if (job.id === equipamento.id) {
          await supervisorQueue.removeRepeatableByKey(job.key);
        }
      }
    }
    
    // Iniciar o agendador de tarefas para verificar os equipamentos
    startEquipamentoTasks();

    return {
      ...updatedTimejob,
      created_at: TimeZoneConfig.timeZone(updatedTimejob.created_at),
      update_at: TimeZoneConfig.timeZone(updatedTimejob.update_at)
    }
  }
}

export { UpdateTimejobService };

