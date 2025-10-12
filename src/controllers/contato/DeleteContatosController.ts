import { Request, Response } from "express";
import { DeletecontatosService } from "../../services/contato/DeleteContatosService";

class DeleteContatoscontroller {

  async handle(req: Request, res: Response) {

    const {contato_id} = req.params;

    if (!contato_id) {
      return res.status(400).json({ error: "id obrigatório!" })
    }

    const deleteContatosService = new DeletecontatosService();

    try {
      const contato = await deleteContatosService.execute({ contato_id });
      return res.json(contato);

    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }
}

export { DeleteContatoscontroller };