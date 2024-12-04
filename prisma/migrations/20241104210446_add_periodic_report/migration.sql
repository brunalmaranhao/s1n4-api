-- AlterEnum
ALTER TYPE "HistoryLogAction" ADD VALUE 'BUDGET_EXPENSE';

-- CreateTable
CREATE TABLE "periodic_reports" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "month" DOUBLE PRECISION NOT NULL,
    "year" DOUBLE PRECISION NOT NULL,
    "url" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "status" "Status" NOT NULL,

    CONSTRAINT "periodic_reports_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "periodic_reports" ADD CONSTRAINT "periodic_reports_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
