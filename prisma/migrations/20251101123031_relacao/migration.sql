-- AlterTable
ALTER TABLE "itens_falhas" ADD COLUMN     "zonaId" TEXT;

-- AddForeignKey
ALTER TABLE "itens_falhas" ADD CONSTRAINT "itens_falhas_zonaId_fkey" FOREIGN KEY ("zonaId") REFERENCES "zonas"("id") ON DELETE CASCADE ON UPDATE CASCADE;
