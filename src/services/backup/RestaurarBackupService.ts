import { exec as _exec } from 'child_process';
import { startEquipamentoTasks } from '../../bullRedis/tasks/supervisor/scheduler';
import util from 'util';
import path from 'path';
import prismaClient from '../../prisma';

const exec = util.promisify(_exec);

export async function restaurarBackup(backupPath: string, databaseUrl?: string) {
  await prismaClient.$disconnect();
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
    console.error('ERRO COMPLETO:', err);

    console.error('STDOUT:\n', err.stdout);

    console.error('STDERR:\n', err.stderr);

    throw new Error(`
    Falha ao restaurar backup:

    STDERR:
    ${err.stderr}

    MESSAGE:
    ${err.message}
    `);;
  }
}

export default restaurarBackup;
