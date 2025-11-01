-- CreateTable
CREATE TABLE "zonas" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "numeroCanal" INTEGER NOT NULL,
    "equipamentoId" TEXT NOT NULL,

    CONSTRAINT "zonas_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "zonas_equipamentoId_numeroCanal_key" ON "zonas"("equipamentoId", "numeroCanal");

-- AddForeignKey
ALTER TABLE "zonas" ADD CONSTRAINT "zonas_equipamentoId_fkey" FOREIGN KEY ("equipamentoId") REFERENCES "equipamentos"("id") ON DELETE CASCADE ON UPDATE CASCADE;
