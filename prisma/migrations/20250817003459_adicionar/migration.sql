-- DropForeignKey
ALTER TABLE "itens_falhas" DROP CONSTRAINT "itens_falhas_logId_fkey";

-- DropForeignKey
ALTER TABLE "logs_envios_mensagens" DROP CONSTRAINT "logs_envios_mensagens_contatoId_fkey";

-- DropForeignKey
ALTER TABLE "logs_falhas" DROP CONSTRAINT "logs_falhas_equipamentoId_fkey";

-- AddForeignKey
ALTER TABLE "logs_falhas" ADD CONSTRAINT "logs_falhas_equipamentoId_fkey" FOREIGN KEY ("equipamentoId") REFERENCES "equipamentos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "itens_falhas" ADD CONSTRAINT "itens_falhas_logId_fkey" FOREIGN KEY ("logId") REFERENCES "logs_falhas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "logs_envios_mensagens" ADD CONSTRAINT "logs_envios_mensagens_contatoId_fkey" FOREIGN KEY ("contatoId") REFERENCES "contatos"("id") ON DELETE CASCADE ON UPDATE CASCADE;
