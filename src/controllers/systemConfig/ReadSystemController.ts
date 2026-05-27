import { Request, Response } from "express";
import { ReadSystemService } from "../../services/systemConfig/ReadSystemService";

class ReadSystemController {

  async handle(req: Request, res: Response) {

    const readSystemService = new ReadSystemService();

    try {
      const systemConfigs = await readSystemService.execute();

      if (systemConfigs.length === 0) {
        return res.json("Nenhuma configuração do sistema cadastrada!");
      }

      return res.json(systemConfigs);

    } catch (err) {
      return res.status(500).json({ error: "Erro ao listar configurações do sistema." });
    }
  }
}

export { ReadSystemController };

 


