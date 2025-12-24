import { Request, Response } from 'express';
import gerarBackup from '../../services/backup/GerarBackupService';

class GerarBackupController {
  async handle(req: Request, res: Response) {
    try {
      const file = await gerarBackup();
      res.download(file);
    } catch (err: any) {
      res.status(500).json({ error: err.message ?? 'Erro ao gerar backup' });
    }
  }
}

export { GerarBackupController };
