import { Emoji as PrismaEmoji, Prisma } from '@prisma/client'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Emoji } from '@/domain/project/enterprise/entities/emoji'

export class PrismaEmojiMapper {
  static toDomain(raw: PrismaEmoji): Emoji {
    return Emoji.create(
      {
        name: raw.name,
        unified: raw.unified,
        category: raw.category,
        char: raw.char,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(emoji: Emoji): Prisma.EmojiUncheckedCreateInput {
    return {
      id: emoji.id.toString(),
      name: emoji.name,
      unified: emoji.unified,
      category: emoji.category,
      char: emoji.char,
    }
  }
}
