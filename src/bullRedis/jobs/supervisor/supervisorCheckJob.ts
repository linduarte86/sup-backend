/**
 * Criar o Job (tarefa) para chamar a API de status do supervisor
 * e verificar o status dos equipamentos.
 * Este job será processado periodicamente para monitorar os equipamentos.
 */

import { Job } from "bull";
import axios from "axios";
import { io } from "../../../server";
import { LogsFalhasService } from "../../../services/logs/logsFalhasService";
import dotenv from "dotenv";
import prismaClient from '../../../prisma';

dotenv.config();

export const supervisorCheckProcesor = async (job: Job) => {
  const { equipamento } = job.data;

  console.log(`Iniciando verificação do equipamento: ${equipamento.name}`);

  try {
    const response = await axios.post(
      `http://${process.env.HOST_SERVER_APISUP}:${process.env.PORT_SERVER_APISUP}/status-falhas`,
      {
        IP: equipamento.ip,
        PORTA: equipamento.port,
        MODELO: equipamento.modelo,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log(`Resposta do equipamento ${equipamento.name}:`, response.data);

    // Chama o serviço de logs de falhas
    await LogsFalhasService(response.data, equipamento);

    // Busca as zonas do equipamento no banco para enviar ao frontend
    const zonas = await prismaClient.zonas.findMany({
      where: { equipamentoId: equipamento.id },
      select: {
        name: true,
        numeroCanal: true
      },
      orderBy: {
        numeroCanal: 'asc'
      }

    });
    const equipamentoZona = Array.isArray(zonas) ? zonas.map(z => z.name) : [];

    // Emite o status atualizado via Socket.io para o frontend
    io.emit("statusEquipamento", {
      equipamentoId: equipamento.id,
      equipamentoIP: equipamento.ip,
      equipamentoPorta: equipamento.port,
      equipamentoDescricao: equipamento.description,
      equipamentoZona,
      status: response.data,
    });

  } catch (err) {
    console.error(`Erro ao verificar ${equipamento.name}:`, err.message);
    // TODO: Gerar log de falha, enviar mensagem se for o caso

    // Emite o erro via Socket.io para o frontend
    io.emit("statusError", {
      equipamentoId: equipamento.id,
      error: err.message,
    });
  }
}