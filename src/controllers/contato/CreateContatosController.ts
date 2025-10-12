import { Request, Response } from "express";
import { CreateContatosService } from "../../services/contato/CreateContatosService";
import { contatoSchema, ContatoData } from "../../schemas/contatos/contatoSchema";
import { ZodError } from "zod";


class ContatosController {
  async handle(req: Request, res: Response) {

    try {

      const data = contatoSchema.parse(req.body) as ContatoData;

      const createContatosService = new CreateContatosService();
      const contato = await createContatosService.execute(data);

      return res.status(201).json(contato);

    } catch (error) {

      if (error instanceof ZodError) {
        const errors = error.issues.map(issue => issue.message);
        return res.status(400).json({ errors });
      }

      return res.status(500).json({ error: error.message || "Erro interno do servidor" });

    }
  }
}

export { ContatosController };