import { PrismaClient } from '@prisma/client'
import { CreateInitialDataSeeder } from './seeders/data-seeder'
import { EmojisSeeder } from './seeders/emojis'

const prisma = new PrismaClient()

async function main() {
  const { createAdminUser, newCustomers } =
    await CreateInitialDataSeeder(prisma)
  // newCustomers();
  createAdminUser()

  // const { createEmojis } = await EmojisSeeder(prisma)
  // await createEmojis()
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect()
  })
