-- AlterTable
ALTER TABLE "_ProjectToTag" ADD CONSTRAINT "_ProjectToTag_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_ProjectToTag_AB_unique";
