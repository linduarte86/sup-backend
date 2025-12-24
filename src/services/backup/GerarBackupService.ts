import { exec as _exec } from 'child_process';
import util from 'util';
import path from 'path';
import fs from "fs";

const exec = util.promisify(_exec);

export async function gerarBackup(destPath?: string): Promise<string> {
  const databaseUrl = process.env.PG_URL;
  if (!databaseUrl) throw new Error('DATABASE_URL não configurada');

  const defaultDir = path.resolve(process.cwd(), "backups");

  if (!fs.existsSync(defaultDir)) {
    fs.mkdirSync(defaultDir, { recursive: true });
  }

  const fileName = destPath
    ? path.resolve(destPath)
    : path.resolve(defaultDir, `backup-${new Date().toISOString().replace(/[:.]/g, '-')}.dump`);

  // comando pg_dump com formato custom (-Fc). Dependendo do ambiente, pode ser necessário extrair
  // parâmetros (host, port, user, dbname) da DATABASE_URL. Aqui supondo que pg_dump aceita a URL.
  const cmd = `pg_dump -Fc -f "${fileName}" "${databaseUrl}"`;

  try {
    const { stdout, stderr } = await exec(cmd);
    if (stdout) console.log('pg_dump stdout:', stdout);
    if (stderr) console.warn('pg_dump stderr:', stderr);
    return fileName;
  } catch (err: any) {
    console.error('Erro ao executar pg_dump:', err);
    throw new Error(`Falha ao gerar backup: ${err.message ?? err}`);
  }
}

export default gerarBackup;
