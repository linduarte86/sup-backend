
import dotenv from 'dotenv';
import express, { Request, Response, NextFunction } from 'express';
import 'express-async-errors';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import prismaClient from './prisma';
import cookieParser from 'cookie-parser';
import { startEquipamentoTasks } from './bullRedis/tasks/supervisor/scheduler';
import "./bullRedis/queues/supervisor/supervisorQueues";
import path from 'path';

import { router } from './routes';


dotenv.config();

const app = express();

const allowedOrigins = process.env.CORS_ORIGIN?.split(',');
app.use(cors({
  origin: (origin, callback) => {
    // Permite chamadas sem origin (ex: Postman, cron, backend)
    if (!origin) return callback(null, true);

    if (allowedOrigins?.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error(`CORS bloqueado para origem: ${origin}`));
  },
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

// Servir arquivos de public/uploads
app.use(
  '/uploads',
  express.static(
    path.resolve(process.cwd(), 'public', 'uploads')
  )
);

app.use(router);

// Criação do servidor HTTP e configuração do Socket.io
const httpServer = http.createServer(app);

// inicialização do Socket.io
export const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins, // Defina a origem permitida para o frontend
    credentials: true,
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
          Zonas: {
            orderBy: {
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




