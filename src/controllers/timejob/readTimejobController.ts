import { Request, Response } from "express";
import { ReadTimejobService } from "../../services/timejob/readTimejobService";

class ReadTimejobController {

  async handle(req: Request, res: Response) {

    const readTimejobService = new ReadTimejobService();

    try {
      const timejobs = await readTimejobService.execute();

      if (timejobs.length === 0) {
        return res.json("Nenhum timejob cadastrado!");
      }

      return res.json(timejobs);

    } catch (err) {
      return res.status(500).json({ error: "Erro ao listar timejobs." });
    }
  }
}

export { ReadTimejobController };