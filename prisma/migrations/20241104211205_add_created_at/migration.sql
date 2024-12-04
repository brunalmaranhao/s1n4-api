/*
  Warnings:

  - Added the required column `createdAt` to the `periodic_reports` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "periodic_reports" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3);
