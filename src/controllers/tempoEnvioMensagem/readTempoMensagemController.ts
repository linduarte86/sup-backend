import { Request, Response } from "express";
import { ReadTempoMensagemService } from "../../services/tempoEnvioMensagem/readTempoMensagemService";

class ReadTempoMensagemController {

  async handle(req: Request, res: Response) {

    const readTempoMensagemService = new ReadTempoMensagemService();

    try {
      
      const tempoMensagens = await readTempoMensagemService.execute();

      if (tempoMensagens.length === 0) {
        return res.json("Nenhum tempo de envio de mensagem cadastrado!");
      }

      return res.json(tempoMensagens);

    } catch (err) {
      return res.status(500).json({ error: "Erro ao listar tempos de envio de mensagens." });
    }
  }
} 

export { ReadTempoMensagemController };