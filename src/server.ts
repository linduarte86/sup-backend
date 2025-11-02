
import dotenv from 'dotenv';
import express, { Request, Response, NextFunction } from 'express';
import 'express-async-errors';
import cors from 'cors';
import { startEquipamentoTasks } from './bullRedis/tasks/supervisor/scheduler';
import "./bullRedis/queues/supervisor/supervisorQueues";

import { router } from './routes';

const app = express();
app.use(express.json());
app.use(cors());
dotenv.config();

app.use(router);

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

app.listen(port, '0.0.0.0', () => {
  console.log(`Servidor online na porta ${port}`);

  // Iniciar o agendador de tarefas para verificar os equipamentos
  startEquipamentoTasks();

});




