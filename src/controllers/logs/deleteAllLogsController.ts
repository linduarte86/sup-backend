import { Request, Response } from "express";
import { DeleteAllLogsService } from "../../services/logs/deleteAllLogsService";

class DeleteAllLogsController {
  async handle(req: Request, res: Response) {
    try {
      console.log(`Iniciando deleção de todos os logs de falhas`);

      const deleteAllLogsService = new DeleteAllLogsService();
      const result = await deleteAllLogsService.execute();

      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ error: "Erro ao deletar todos os logs." });
    }
  }
}   

export { DeleteAllLogsController };