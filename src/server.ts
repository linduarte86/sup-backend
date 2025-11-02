
import dotenv from 'dotenv';
import express, { Request, Response, NextFunction } from 'express';
import 'express-async-errors';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
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
export const io = new Server(httpServer, {
  cors: {
    origin: process.env.CORS_ORIGIN || "*", // Defina a origem permitida para o frontend
  },
});

// Evento de conexão do Socket.io
io.on("connection", (socket) => {
  console.log(`Cliente conectado no Socket.io: ${socket.id}`);

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




