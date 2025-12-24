import { exec as _exec } from 'child_process';
import { startEquipamentoTasks } from '../../bullRedis/tasks/supervisor/scheduler';
import util from 'util';
import path from 'path';

const exec = util.promisify(_exec);

export async function restaurarBackup(backupPath: string, databaseUrl?: string) {
  if (!backupPath) throw new Error('backupPath é obrigatório');
  const dbUrl = databaseUrl ?? process.env.PG_URL;
  if (!dbUrl) throw new Error('DATABASE_URL não configurada');

  const absPath = path.resolve(backupPath);

  const cmd = `pg_restore --clean --no-owner -d ${dbUrl} "${absPath}"`;

  try {
    const { stdout, stderr } = await exec(cmd);
    if (stdout) console.log('pg_restore stdout:', stdout);
    if (stderr) console.warn('pg_restore stderr:', stderr);

    // Iniciar o agendador de tarefas para verificar os equipamentos
    startEquipamentoTasks();

    return true;

  } catch (err: any) {
    console.error('Erro ao executar pg_restore:', err);
    throw new Error(`Falha ao restaurar backup: ${err.message ?? err}`);
  }
}

export default restaurarBackup;
