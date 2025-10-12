import Queue from "bull";
import { sendNotificationProcessor } from "../../jobs/notification/sendNotificationJob";
import dotenv from "dotenv"; 

dotenv.config();

/**
 * Configuração da fila de notificações
 * Utiliza Bull para gerenciar o envio de notificações via WhatsApp e e-mail.
 */

export const notificationQueue = new Queue("sendNotification", {
  redis: {
    host: process.env.REDIS_HOST || "localhost",
    port: process.env.REDIS_PORT ? Number(process.env.REDIS_PORT) : 6379,
    //password: "your_redis_password", // Substitua pela sua senha do Redis
  },
});

notificationQueue.process("sendNotification", sendNotificationProcessor);
