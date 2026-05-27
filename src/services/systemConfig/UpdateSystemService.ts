import prismaClient from "../../prisma";
import { TimeZoneConfig } from "../../config/timezone/TimeZone";
import { SystemConfigUpdateData, systemConfigUpdateSchema } from "../../schemas/systemConfig/systemConfigSchema";
import path from 'path';
import fs from 'fs';

class UpdateSystemService {

  async execute(id: string, data: SystemConfigUpdateData) {

    // Validar os dados de entrada
    systemConfigUpdateSchema.parse(data);

    // Se um arquivo temporário foi enviado (logoFilePath), mover para public/uploads e setar logoUrl
    const payload: any = { ...data };

    // busca registro existente para poder remover logo antiga se necessário
    let existingLogo: string | null = null;
    try {
      const existing = await prismaClient.systemConfig.findUnique({ where: { id }, select: { logoUrl: true } });
      existingLogo = existing?.logoUrl ?? null;
    } catch (e) {
      // ignore
      existingLogo = null;
    }

    if (payload.logoFilePath && typeof payload.logoFilePath === 'string') {
      const tmpPath = payload.logoFilePath;
      const ext = path.extname(tmpPath).toLowerCase();
      // permitir somente .png
      if (ext !== '.png') {
        // tenta remover o arquivo temporário se existir
        try { if (fs.existsSync(tmpPath)) fs.unlinkSync(tmpPath); } catch(e){}
        throw new Error('Apenas arquivos PNG são permitidos para a logo');
      }

      const uploadDir = path.resolve(process.cwd(), 'public', 'uploads');
      if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

      const fileName = `logo-${Date.now()}.png`;
      const destPath = path.join(uploadDir, fileName);

      // mover/renomear arquivo temporário para a pasta pública
      try {
        await fs.promises.rename(tmpPath, destPath);
      } catch (err) {
        // se rename falhar (ex: cross-device), copia e remove
        try {
          await fs.promises.copyFile(tmpPath, destPath);
          await fs.promises.unlink(tmpPath);
        } catch (e) {
          throw new Error('Falha ao processar arquivo de logo');
        }
      }

      // caminho público relativo
      payload.logoUrl = `/uploads/${fileName}`;
      delete payload.logoFilePath;

      // remove a logo antiga (se existir e diferente da nova)
      try {
        if (existingLogo && typeof existingLogo === 'string') {
          const oldRelative = existingLogo.replace(/^\//, '');
          const oldPath = path.resolve(process.cwd(), 'public', oldRelative);
          if (oldPath !== destPath && fs.existsSync(oldPath)) {
            try { await fs.promises.unlink(oldPath); } catch (e) { /* ignore */ }
          }
        }
      } catch (e) {
        // não falhar se remoção não funcionar
      }
    }

    // Atualizar o registro no banco de dados
    const updatedSystemConfig = await prismaClient.systemConfig.update({
      where: { id },
      data: payload,
      select: {
        id: true,
        empresaName: true,
        logoUrl: true,
        email: true,
        telefone: true,
        endereco: true,
        created_at: true,
        update_at: true
      }
    });

    return {
      ...updatedSystemConfig,
      created_at: TimeZoneConfig.timeZone(updatedSystemConfig.created_at),
      update_at: TimeZoneConfig.timeZone(updatedSystemConfig.update_at)
    };
  }
}

export { UpdateSystemService };