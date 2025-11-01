import { Request, Response } from "express";
import { UpdateZonaService } from "../../services/zona/UpdateZonaService";
import { zonasUpdateSchema } from "../../schemas/zonas/zonasUpdateSchema";
import { ZodError } from "zod";

class UpdateZonaController {
  async handle(req: Request, res: Response) {
    const { equipamentoID } = req.params;
    const data = req.body;

    try {
      // Valida com Zod
      const validatedData = zonasUpdateSchema.parse(data);

      const service = new UpdateZonaService();
      const updatedZona = await service.execute(equipamentoID, validatedData.zonas);

      return res.json(updatedZona);

    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.issues.map(issue => issue.message);
        return res.status(400).json({ errors });
      }

      console.error(error);
      return res.status(500).json({ error: "Erro inesperado" });
    }
  }
}

export { UpdateZonaController };
