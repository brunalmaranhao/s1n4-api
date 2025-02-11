import { PrismaClient } from '@prisma/client'
import { CreateInitialDataSeeder } from './seeders/data-seeder'
import { EmojisSeeder } from './seeders/emojis'

const prisma = new PrismaClient()

async function main() {
  const { createAdminUser, newCustomers, createDepartments } =
    await CreateInitialDataSeeder(prisma)
  await createDepartments()
  await newCustomers()
  await createAdminUser()

  // const { createEmojis } = await EmojisSeeder(prisma)
  // await createEmojis()
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect()
  })
