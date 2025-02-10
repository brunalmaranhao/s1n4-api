-- CreateEnum
CREATE TYPE "Permission" AS ENUM ('VIEW_REPORT', 'VIEW_PROJECT', 'VIEW_FINANCIAL', 'CREATE_COMMENT', 'CREATE_REACTION');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "departmentId" TEXT;

-- CreateTable
CREATE TABLE "departments" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "permissions" "Permission"[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "departments_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "departments"("id") ON DELETE SET NULL ON UPDATE CASCADE;
