import prismaClient from "../../prisma";

// Service para deletar logs de falhas por ID 
class DeleteLogsService {
  async execute(logId: string) {
    try {
      // Verifica se o log existe
      const log = await prismaClient.logFalha.findUnique({
        where: { id: logId }
      });

      if (!log) {
        throw new Error("Log não encontrado.");
      }

      // Deleta o log e seus itens associados
      await prismaClient.itemFalha.deleteMany({
        where: { logId }
      });

      await prismaClient.logFalha.delete({
        where: { id: logId }
      });

      return { message: "Log deletado com sucesso." };
    } catch (error) {
      throw new Error(`Erro ao deletar log: ${error.message}`);
    }
  }
}

export { DeleteLogsService };