import { Request, Response } from "express";
import { ReadLogsService } from "../../services/logs/readLogsService";

class ReadLogsController {
  async handle(req: Request, res: Response) {
    
    try {
      const readLogsService = new ReadLogsService();
      const logs = await readLogsService.execute();

      if (logs.length === 0) {
        return res.json("Nenhum log encontrado!");
      }

      return res.json(logs);

    } catch (error) {
      return res.status(500).json({ error: "Erro ao listar logs." });
    }
  }
}

export { ReadLogsController };
