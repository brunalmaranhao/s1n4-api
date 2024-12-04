-- AlterTable
ALTER TABLE "notifications" ADD COLUMN     "projectUpdatesId" TEXT;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_projectUpdatesId_fkey" FOREIGN KEY ("projectUpdatesId") REFERENCES "project_updates"("id") ON DELETE SET NULL ON UPDATE CASCADE;
