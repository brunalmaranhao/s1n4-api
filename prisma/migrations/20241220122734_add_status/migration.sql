/*
  Warnings:

  - Added the required column `status` to the `answers` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "answers" ADD COLUMN     "status" "Status" NOT NULL;
