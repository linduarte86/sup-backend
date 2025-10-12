import { Request, Response } from "express";
import { UpdateTempoMensagemService } from "../../services/tempoEnvioMensagem/updateTempoMensagemService";
import { TempoMensagemUpdateData } from "../../schemas/tempoEnvioMensagem/tempoMensagemSchema";
import { ZodError } from "zod";

// Controlador para atualizar o tempo de envio de mensagens
class UpdateTempoMensagemController {
  async handle(req: Request, res: Response) {
    const { id } = req.params;
    const data: TempoMensagemUpdateData = req.body;

    const updateTempoMensagemService = new UpdateTempoMensagemService();

    try {

      const updatedTempoEnvioMensagem = await updateTempoMensagemService.execute(id, data);

      return res.json(updatedTempoEnvioMensagem);

    } catch (error) {

      if (error instanceof ZodError) {
        const errors = error.issues.map(issue => issue.message);
        return res.status(400).json({ errors });
      }
      
      return res.status(500).json({ message: "Erro inesperado ao atualizar o tempo de envio de mensagens" });
    }
  }
}

export { UpdateTempoMensagemController };
