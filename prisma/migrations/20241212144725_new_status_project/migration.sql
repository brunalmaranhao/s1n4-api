/*
  Warnings:

  - The values [APPROVED,DISAPPROVED,WAITING,CANCELED,IN_PROGRESS] on the enum `StatusProject` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "StatusProject_new" AS ENUM ('ACTIVE', 'INACTIVE', 'DONE');
ALTER TYPE "StatusProject" RENAME TO "StatusProject_old";
ALTER TYPE "StatusProject_new" RENAME TO "StatusProject";
DROP TYPE "StatusProject_old";
COMMIT;
