import { Request, Response } from 'express';
import restaurarBackup from '../../services/backup/RestaurarBackupService';

class RestaurarBackupController {

  async handle(req: Request, res: Response) {
    try {
      // multer adiciona `file` no objeto Request; tipagem do Express pode requerer casting
      const anyReq = req as any;
      if (!anyReq.file) return res.status(400).json({ error: 'Arquivo obrigatório' });
      const filePath = anyReq.file.path;
      await restaurarBackup(filePath);
      return res.json({ ok: true });
    } catch (err: any) {
      return res.status(500).json({ error: err.message ?? 'Erro ao restaurar backup' });
    }
  }
}

export { RestaurarBackupController };