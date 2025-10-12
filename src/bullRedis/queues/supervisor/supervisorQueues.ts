import Queue from "bull";
import { supervisorCheckProcesor } from "../../jobs/supervisor/supervisorCheckJob";
import dotenv from "dotenv";

dotenv.config();

/**
 * Configuração da fila de verificação do supervisor
 * Utiliza Bull para gerenciar as tarefas de verificação periódica dos equipamentos.
 */

export const supervisorQueue = new Queue("verificar-equipamento", {
  redis: {
    host: process.env.REDIS_HOST || "localhost",
    port: process.env.REDIS_PORT ? Number(process.env.REDIS_PORT) : 6379,
    //password: "your_redis_password", // Substitua pela sua senha do Redis
  },
});

supervisorQueue.process("verificar-equipamento",supervisorCheckProcesor);