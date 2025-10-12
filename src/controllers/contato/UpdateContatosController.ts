import { Request, Response } from "express";
import { UpdateContatosService } from "../../services/contato/UpdateContatosService";
import { contatoUpdateSchema } from "../../schemas/contatos/contatoSchema";
import { ZodError } from "zod";

class UpdateContatosController {

  async handle(req: Request, res: Response) {

    const { contato_id } = req.params;
    const data = req.body;

    const updateContatosService = new UpdateContatosService();

    try {

      const validatedData = contatoUpdateSchema.parse(data);
      const updataContato = await updateContatosService.execute(contato_id, validatedData);

      return res.json(updataContato);

    } catch (error) {

      if (error instanceof ZodError) {
        const errors = error.issues.map(issue => issue.message);
        return res.status(400).json({ errors });
      }

      return res.status(500).json({ error: "Erro inesperado" });
    }
  }
}
export { UpdateContatosController };

