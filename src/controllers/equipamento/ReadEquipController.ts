import { Request, Response } from "express";
import { ReadEquipService } from "../../services/equipamento/ReadEquipService";

class ReadEquipController {

  async handle(req: Request, res: Response) {

    try {

      const readEquipService = new ReadEquipService();
      const equip = await readEquipService.execute();

      if (equip.length === 0) {
        return res.json("Nenhum equipamento cadastrado!")
      }

      return res.json(equip);

    } catch (error) {
      return res.status(500).json({ error: "Erro ao listar equipamentos." });
    }
  }
}

export { ReadEquipController }