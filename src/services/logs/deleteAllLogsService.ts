import prismaClient from "../../prisma";

// Service para deletar todos os logs de falhas
class DeleteAllLogsService {
  async execute() {
    try {
      // Deleta todos os itens de falha associados aos logs
      await prismaClient.itemFalha.deleteMany({});

      // Deleta todos os logs de falha
      await prismaClient.logFalha.deleteMany({});

      return { message: "Todos os logs deletados com sucesso." };
    } catch (error) {
      throw new Error(`Erro ao deletar todos os logs: ${error.message}`);
    }
  }
}

export { DeleteAllLogsService };