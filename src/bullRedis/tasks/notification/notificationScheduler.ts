import { notificationQueue } from "../../queues/notification/notificationQueue";
import prismaClient from "../../../prisma";

export async function sendNotification(equipamento, mensagem) {
  try {
    // Busca todos os contatos que devem receber notificações
    const contatos = await prismaClient.contato.findMany({
      where: {
        OR: [
          { receberEmail: true },
          { receberWhats: true }
        ]
      }
    });

    for (const contato of contatos) {
      await notificationQueue.add("sendNotification", {
        contato,
        mensagem,
        equipamento
      });
      console.log(`Notificação agendada para o contato ${contato.name}`);
    }
  } catch (error) {
    console.error("Erro ao agendar notificações:", error);
  }
}
