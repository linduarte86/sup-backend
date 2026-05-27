import prismaClient from '../prisma';
import { hash } from 'bcryptjs';

async function main() {

  // ================================
  // PERMISSÕES
  // ================================

  const permissions = [
    {
      key: 'DASHBOARD_VIEW',
      description: 'Ver dashboard'
    },
    {
      key: 'MONITORAMENTO_VIEW',
      description: 'Ver eventos'
    },
    {
      key: 'CONFIG_VIEW',
      description: 'Ver configurações'
    },
    {
      key: 'SUPERVISAO_VIEW',
      description: 'Ver supervisao'
    },
    {
      key: 'SUPERVISAO_CREATE',
      description: 'Criar supervisao'
    },
    {
      key: 'SUPERVISAO_EDIT',
      description: 'Editar supervisao'
    },
    {
      key: 'SUPERVISAO_DELETE',
      description: 'Excluir supervisao'
    },
    {
      key: 'SUPERVISAO_EDIT_ZONAS',
      description: 'Editar zonas supervisao'
    },
    {
      key: 'USERS_VIEW',
      description: 'Ver usuários'
    },
    {
      key: 'USERS_CREATE',
      description: 'Criar usuários'
    },
    {
      key: 'USERS_EDIT',
      description: 'Editar usuários'
    },
    {
      key: 'USERS_DELETE',
      description: 'Excluir usuários'
    },
    {
      key: 'CONTATOS_VIEW',
      description: 'Ver contatos'
    },
    {
      key: 'CONTATOS_CREATE',
      description: 'Criar contatos'
    },
    {
      key: 'CONTATOS_EDIT',
      description: 'Editar contatos'
    },
    {
      key: 'CONTATOS_DELETE',
      description: 'Excluir contatos'
    },
    {
      key: 'TIMER_VIEW',
      description: 'Ver timer'
    },
    {
      key: 'BACKUP_VIEW',
      description: 'Ver backup'
    },
    {
      key: 'BACKUP_RESTORE',
      description: 'Restaurar backup'
    },
    {
      key: 'LOGS_VIEW',
      description: 'Ver logs'
    },
    {
      key: 'LOGS_DELETE',
      description: 'Ecluir logs'
    },
  ];

  for (const permission of permissions) {

    const permissionExists =
      await prismaClient.permission.findUnique({
        where: {
          key: permission.key
        }
      });

    if (!permissionExists) {

      await prismaClient.permission.create({
        data: permission
      });

      console.log(`Permissão ${permission.key} criada com sucesso!`);

    } else {

      console.log(`Permissão ${permission.key} já existe!`);
    }
  }

  // ================================
  // USUÁRIO ADMIN
  // ================================

  const userAdminExists =
    await prismaClient.user.findUnique({
      where: {
        email: 'admin@admin.com'
      }
    });

  if (!userAdminExists) {

    const passwordHash = await hash('admin', 8);

    await prismaClient.user.create({
      data: {
        name: 'admin',
        email: 'admin@admin.com',
        password: passwordHash,
        nivel: 'ADMIN'
      }
    });

    console.log('Usuário admin criado com sucesso!');

  } else {

    console.log('Usuário admin já existe!');
  }

  // ================================
  // USUÁRIO APEL
  // ================================

  const userApelExists =
    await prismaClient.user.findUnique({
      where: {
        email: 'apel@apel.com'
      }
    });

  if (!userApelExists) {

    const passwordHash = await hash('45362718', 8);

    const apelUser = await prismaClient.user.create({
      data: {
        name: 'apel',
        email: 'apel@apel.com',
        password: passwordHash,
        nivel: 'ADMIN'
      }
    });

    console.log('Usuário apel criado com sucesso!');

  } else {

    console.log('Usuário apel já existe!');
  }

  // ================================
  // TIMEJOB
  // ================================

  const exiteTimejob =
    await prismaClient.timejob.findUnique({
      where: {
        name: 'timejob'
      }
    });

  if (!exiteTimejob) {

    await prismaClient.timejob.create({
      data: {
        name: 'timejob',
        intervalo_ms: 5000,
      }
    });

    console.log('Timejob de 5000ms criado com sucesso!');

  } else {

    console.log('Timejob já existe!');
  }

  // ================================
  // TEMPO ENVIO MENSAGEM
  // ================================

  const tempoEnvioMensagemExists =
    await prismaClient.tempoEnvioMensagem.findUnique({
      where: {
        name: 'tempoEnvioMensagem'
      }
    });

  if (!tempoEnvioMensagemExists) {

    await prismaClient.tempoEnvioMensagem.create({
      data: {
        name: 'tempoEnvioMensagem',
        tempo: 60000
      }
    });

    console.log(
      'TempoEnvioMensagem de 60000ms criado com sucesso!'
    );

  } else {

    console.log('TempoEnvioMensagem já existe!');
  }

  // ================================
  // DESCRIÇÃO DO SISTEMA
  // ================================

  const system_configExists = await prismaClient.systemConfig.findFirst();

  if (!system_configExists) {

    await prismaClient.systemConfig.create({
      data: {
        empresaName: 'Apel - Alicações Eletrônicas',
        logoUrl: 'https://i.imgur.com/1ZQZt2X.png',
        email: 'apel@apel.com',
        telefone: '(83) 3331-2121',
        endereco: 'Av. Jorn. Assis Chateaubriand, 4193 - Distrito Industrial, Campina Grande - PB, 58105-421',
      }
    });

    console.log('Descrição do sistema criada com sucesso!');

  } else {

    console.log('Descrição do sistema já existe!');
  }

}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prismaClient.$disconnect();
  });