import { Request, Response } from "express";
import { DeleteLogsService } from "../../services/logs/deleteLogsService";

class DeleteLogsController {
  async handle(req: Request, res: Response) {

    const { log_id } = req.params;

    try {

      console.log(`Deletando log com ID: ${log_id}`);
     
      const deleteLogsService = new DeleteLogsService();
      await deleteLogsService.execute(log_id.trim());

      return res.status(200).json({ message: "Log deletado com sucesso!." });
    } catch (error) {
      return res.status(500).json({ error: "Erro ao deletar Log." });
    }
  }
}   

export { DeleteLogsController };

