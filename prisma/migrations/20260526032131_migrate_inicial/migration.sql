-- CreateEnum
CREATE TYPE "NivelUsuario" AS ENUM ('ADMIN', 'OPERADOR');

-- CreateEnum
CREATE TYPE "TipoFalha" AS ENUM ('AMPLIFICADOR', 'LINHA');

-- CreateEnum
CREATE TYPE "MeioEnvio" AS ENUM ('EMAIL', 'WHATSAPP');

-- CreateEnum
CREATE TYPE "StatusEnvio" AS ENUM ('SUCESSO', 'FALHA');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "nivel" "NivelUsuario" NOT NULL DEFAULT 'OPERADOR',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "permissions" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users_permissions" (
    "userId" TEXT NOT NULL,
    "permissionId" TEXT NOT NULL,

    CONSTRAINT "users_permissions_pkey" PRIMARY KEY ("userId","permissionId")
);

-- CreateTable
CREATE TABLE "equipamentos" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "modelo" INTEGER NOT NULL DEFAULT 2,
    "description" TEXT NOT NULL,
    "ip" TEXT NOT NULL,
    "port" INTEGER NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "equipamentos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "zonas" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "numeroCanal" INTEGER NOT NULL,
    "equipamentoId" TEXT NOT NULL,

    CONSTRAINT "zonas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "timejob" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "intervalo_ms" INTEGER NOT NULL DEFAULT 1000,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "timejob_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "logs_falhas" (
    "id" TEXT NOT NULL,
    "equipamentoId" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "logs_falhas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "itens_falhas" (
    "id" TEXT NOT NULL,
    "logId" TEXT NOT NULL,
    "tipo" "TipoFalha" NOT NULL,
    "indice" INTEGER NOT NULL,
    "descricao" TEXT NOT NULL,
    "zonaId" TEXT,

    CONSTRAINT "itens_falhas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contatos" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "telefone" TEXT,
    "receberEmail" BOOLEAN NOT NULL DEFAULT true,
    "receberWhats" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contatos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "logs_envios_mensagens" (
    "id" TEXT NOT NULL,
    "contatoId" TEXT NOT NULL,
    "meioEnvio" "MeioEnvio" NOT NULL,
    "conteudo" TEXT NOT NULL,
    "status" "StatusEnvio" NOT NULL,
    "erro" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "logs_envios_mensagens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tempo_envio_mensagens" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "tempo" INTEGER NOT NULL DEFAULT 60000,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tempo_envio_mensagens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system_config" (
    "id" UUID NOT NULL,
    "empresa_name" VARCHAR(200),
    "logo_url" TEXT,
    "email" VARCHAR(200),
    "telefone" VARCHAR(20),
    "endereco" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "system_config_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "permissions_key_key" ON "permissions"("key");

-- CreateIndex
CREATE UNIQUE INDEX "zonas_equipamentoId_numeroCanal_key" ON "zonas"("equipamentoId", "numeroCanal");

-- CreateIndex
CREATE UNIQUE INDEX "timejob_name_key" ON "timejob"("name");

-- CreateIndex
CREATE UNIQUE INDEX "contatos_email_key" ON "contatos"("email");

-- CreateIndex
CREATE UNIQUE INDEX "tempo_envio_mensagens_name_key" ON "tempo_envio_mensagens"("name");

-- AddForeignKey
ALTER TABLE "users_permissions" ADD CONSTRAINT "users_permissions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users_permissions" ADD CONSTRAINT "users_permissions_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "permissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "zonas" ADD CONSTRAINT "zonas_equipamentoId_fkey" FOREIGN KEY ("equipamentoId") REFERENCES "equipamentos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "logs_falhas" ADD CONSTRAINT "logs_falhas_equipamentoId_fkey" FOREIGN KEY ("equipamentoId") REFERENCES "equipamentos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "itens_falhas" ADD CONSTRAINT "itens_falhas_logId_fkey" FOREIGN KEY ("logId") REFERENCES "logs_falhas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "itens_falhas" ADD CONSTRAINT "itens_falhas_zonaId_fkey" FOREIGN KEY ("zonaId") REFERENCES "zonas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "logs_envios_mensagens" ADD CONSTRAINT "logs_envios_mensagens_contatoId_fkey" FOREIGN KEY ("contatoId") REFERENCES "contatos"("id") ON DELETE CASCADE ON UPDATE CASCADE;
