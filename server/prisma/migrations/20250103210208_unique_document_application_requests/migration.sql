/*
  Warnings:

  - A unique constraint covering the columns `[applicationId,documentId]` on the table `DocumentRequest` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "DocumentRequest_applicationId_documentId_key" ON "DocumentRequest"("applicationId", "documentId");
