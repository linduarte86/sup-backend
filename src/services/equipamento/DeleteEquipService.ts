import { error } from "console";
import prismaClient from "../../prisma";
import { supervisorQueue } from "../../bullRedis/queues/supervisor/supervisorQueues";

interface EquipRequest {
  equip_id: string
}

class DeleteEquipSevice {
  async execute({ equip_id }: EquipRequest) {

    const equipExist = await prismaClient.equipamento.findUnique({
      where: { id: equip_id }
    })

    const Timejob = await prismaClient.timejob.findFirst({
      where: { name: "timejob" }
    });

    if (!equipExist) {
      throw new error("Equipamento não encontrado!")
    }

    const jobs = await supervisorQueue.getRepeatableJobs();
    for (const job of jobs) {
      if (job.id === equip_id) {
        await supervisorQueue.removeRepeatableByKey(job.key);
      }
    }

    const equip = await prismaClient.equipamento.delete({
      where: { id: equip_id }
    })

    return { message: "Equipamento deletado com sucesso!" };

  }
}

export { DeleteEquipSevice };