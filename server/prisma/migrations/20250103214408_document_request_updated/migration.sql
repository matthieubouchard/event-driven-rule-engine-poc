-- AlterTable
ALTER TABLE "DocumentRequest" ADD COLUMN     "updatedAt" TIMESTAMP(3);

-- DropEnum
DROP TYPE "DocumentType";
