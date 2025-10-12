import { Request, Response } from "express";
import { UpdateEquipService } from "../../services/equipamento/UpdateEquipService";
import { equipUpdateSchema } from "../../schemas/equipamentos/equipSchema";
import { ZodError } from "zod";

class UpdateEquipController {
  async handle(req: Request, res: Response) {
    const { equip_id } = req.params; // Recebe o id da rota
    const data = req.body;     // Recebe os dados atualizáveis

    const updateEquipService = new UpdateEquipService();

    try {
      // Valida se os dados estão corretos (lança erro se inválido)
      const validatedData = equipUpdateSchema.parse(data);

      const updatedEquip = await updateEquipService.execute(equip_id, validatedData);

      return res.json(updatedEquip);

    } catch (error) {

      if (error instanceof ZodError) {
        const errors = error.issues.map(issue => issue.message);

        return res.status(400).json({ errors });
      }

      return res.status(500).json({ error: "Erro inesperado" });
    }
  }
}

export { UpdateEquipController };
