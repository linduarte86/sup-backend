import { Request, Response } from "express";
import { UpdateTimejobService } from "../../services/timejob/updateTimejobService";
import { timejobUpdateSchema } from "../../schemas/timejob/timejobSchema";
import { ZodError } from "zod";

class UpdateTimejobController {
  async handle(req: Request, res: Response) {
    // Extrair o ID do parâmetro da rota e os dados do corpo da requisição
    const { id } = req.params;
    const data = req.body;

    const updateTimejobService = new UpdateTimejobService();

    try {
      // Validar os dados de entrada usando o schema
      const validatedData = timejobUpdateSchema.parse(data);

      const updatedTimejob = await updateTimejobService.execute(id, validatedData);

      return res.json(updatedTimejob);

    } catch (error) {

      if (error instanceof ZodError) {
        // Se for um erro de validação, extrair as mensagens de erro
        const errors = error.issues.map(issue => issue.message);
        return res.status(400).json({ errors });
      }

      return res.status(500).json({ error: "Erro inesperado ao atualizar o timejob" });
    }

  }
}
export { UpdateTimejobController };

