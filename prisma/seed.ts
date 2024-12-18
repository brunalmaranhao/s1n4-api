import { PrismaClient } from "@prisma/client";
import { CreateInitialDataSeeder } from "./seeders/data-seeder";

const prisma = new PrismaClient();

async function main() {
  const { createAdminUser, newCustomers } =
    await CreateInitialDataSeeder(prisma);
  // newCustomers();
  createAdminUser();
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
