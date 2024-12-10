/*
  Warnings:

  - You are about to drop the column `statusProject` on the `projects` table. All the data in the column will be lost.
  - Added the required column `listProjectsId` to the `projects` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `projects` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "projects" DROP COLUMN "statusProject",
ADD COLUMN     "listProjectsId" TEXT NOT NULL,
ADD COLUMN     "status" "Status" NOT NULL;

-- CreateTable
CREATE TABLE "list_projects" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "status" "Status" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "list_projects_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "list_projects_name_key" ON "list_projects"("name");

-- AddForeignKey
ALTER TABLE "list_projects" ADD CONSTRAINT "list_projects_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_listProjectsId_fkey" FOREIGN KEY ("listProjectsId") REFERENCES "list_projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
