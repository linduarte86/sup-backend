import prismaClient from '../prisma';
import { hash } from 'bcryptjs';

async function main() {

  const userAdminExists = await prismaClient.user.findFirst({
    where: {
      email: 'admin@admin.com'
    }
  });

   const userApelExists = await prismaClient.user.findFirst({
    where: {
      email: 'apel@apel.com'
    }
  });

  const exiteTimejob = await prismaClient.timejob.findFirst({
    where: {
      name: 'timejob'
    }
  });

  const tempoEnvioMensagemExists = await prismaClient.tempoEnvioMensagem.findFirst({
    where: {
      name: 'tempoEnvioMensagem'  
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

  if (!userApelExists) {
    const passwordHash = await hash('45362718', 8);

    await prismaClient.user.create({
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

  if (!exiteTimejob) {
    
    await prismaClient.timejob.create({
      data: {
        name: 'timejob',
        intervalo_ms: 5000,
      }
    });

    console.log('Timejob de 5000ms criado com sucesso!');
  }else{
    console.log('Timejob já existe!');
  }

  if (!tempoEnvioMensagemExists) {
    
    await prismaClient.tempoEnvioMensagem.create({
      data: {
        name: 'tempoEnvioMensagem',
        tempo: 60000, // Tempo em milissegundos (60 segundos)
      }
    });

    console.log('TempoEnvioMensagem de 60000ms (60 segundos) criado com sucesso!');
  }else{
    console.log('TempoEnvioMensagem já existe!');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    prismaClient.$disconnect();
  });
