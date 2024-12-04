/*
  Warnings:

  - You are about to drop the column `customerId` on the `periodic_reports` table. All the data in the column will be lost.
  - Added the required column `projectId` to the `periodic_reports` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "periodic_reports" DROP CONSTRAINT "periodic_reports_customerId_fkey";

-- AlterTable
ALTER TABLE "periodic_reports" DROP COLUMN "customerId",
ADD COLUMN     "projectId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "periodic_reports" ADD CONSTRAINT "periodic_reports_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
