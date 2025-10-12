import { ZodError } from "zod";
import { Request, Response } from "express";
import { equipSchema, EquipData } from "../../schemas/equipamentos/equipSchema";
import { CreateEquipService } from "../../services/equipamento/CreateEquipService";

class CreateEquipController {
  async handle(req: Request, res: Response) {
    try {
      const data = equipSchema.parse(req.body);

      const createEquipService = new CreateEquipService();
      const equipamento = await createEquipService.execute(data);

      return res.status(201).json(equipamento);

    } catch (error) {

      if (error instanceof ZodError) {
        const errors = error.issues.map(issue => issue.message);

        return res.status(400).json({ errors });
      }

      // Para qualquer outro erro inesperado
      return res.status(500).json({ error: error.message || "Erro interno do servidor" });
    }
  }
}

export { CreateEquipController };

