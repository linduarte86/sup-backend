import { Request, Response } from "express";
import { ReadContatosService } from "../../services/contato/ReadContatosService";

class ReadContatosController {

  async handle(req: Request, res: Response) {

    const readContatosService = new ReadContatosService();

    try {

      const contatos = await readContatosService.execute();

      if (contatos.length === 0) {
        return res.json("Nenhum contato cadastrado!");
      }

      return res.json(contatos);

    } catch (error) {
      return res.status(500).json({ error: "Erro ao listar Contatos" });
    }
  }
}

export { ReadContatosController };