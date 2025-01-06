import { PrismaClient } from '@prisma/client'
import emojis from 'emoji.json'

export async function EmojisSeeder(prisma: PrismaClient) {
  async function createEmojis() {
    await prisma.emoji.deleteMany()

    for (const emoji of emojis) {
      const unifiedCode = emoji.codes.toUpperCase().replace(/\s+/g, '-')
      await prisma.emoji.upsert({
        where: { unified: unifiedCode },
        update: {},
        create: {
          name: emoji.name,
          unified: unifiedCode,
          category: emoji.category,
          char: emoji.char,
        },
      })
    }
  }
  return { createEmojis }
}
