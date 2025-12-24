
import dotenv from 'dotenv';
import express, { Request, Response, NextFunction } from 'express';
import 'express-async-errors';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import prismaClient from './prisma';
import { startEquipamentoTasks } from './bullRedis/tasks/supervisor/scheduler';
import "./bullRedis/queues/supervisor/supervisorQueues";

import { router } from './routes';


dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
app.use(router);

// Criação do servidor HTTP e configuração do Socket.io
const httpServer = http.createServer(app);

// inicialização do Socket.io
const allowedOrigins = process.env.CORS_ORIGIN?.split(',');
export const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins, // Defina a origem permitida para o frontend
  },
});

// Evento de conexão do Socket.io
io.on("connection", (socket) => {
  console.log(`Cliente conectado no Socket.io: ${socket.id}`);

  socket.on("getStatusAtaul", async () => {
    try {
      const equipamentos = await prismaClient.equipamento.findMany({
        include: {
          LogFalha: {
            orderBy: {
              created_at: "desc"
            },
            take: 1
          },
          Zonas:{
            orderBy:{
              name: "desc"
            }
          }
        }
      });

      // monta o formato de resposta para o frontend
      const status = equipamentos.map(equip => ({
        id: equip.id,
        nome: equip.name,
        ip: equip.ip,
        porta: equip.port,
        zona: equip.Zonas.map(z => z.name),
        description: equip.description,
        status: equip.LogFalha[0]?.descricao || null,
      }));

      // envia o status atualizado para o cliente conectado
      socket.emit("statusAtual", status);
    } catch (err) {
      console.log("Erro ao enviar status:", err);
    }
  })
  socket.on("disconnect", () => {
    console.log(`Cliente desconectado do Socket.io: ${socket.id}`);
  });
});

// Middleware de tratamento de erros
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof Error) {
    return res.status(400).json({
      error: err.message,
    });
  }

  return res.status(500).json({
    status: 'error',
    message: 'Internal Server Error',
  });
});

// Middleware para rotas não encontradas
app.use((req, res) => {
  res.status(404).json({ error: "Rota não encontrada." });
});

const port: number = Number(process.env.PORT_SERVER) || 3333;

// Inicia o servidor HTTP
httpServer.listen(port, '0.0.0.0', () => {
  console.log(`Servidor online na porta ${port}`);
  console.log(`CORS liberado para: ${process.env.CORS_ORIGIN}`);

  // Iniciar o agendador de tarefas para verificar os equipamentos
  startEquipamentoTasks();

});




