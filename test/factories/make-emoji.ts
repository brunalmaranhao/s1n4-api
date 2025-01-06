import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Emoji, EmojiProps } from '@/domain/project/enterprise/entities/emoji'
import { PrismaEmojiMapper } from '@/infra/database/prisma/mappers/prisma-emoji-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { Injectable } from '@nestjs/common'

export function makeEmoji(
  override: Partial<EmojiProps> = {},
  id?: UniqueEntityID,
) {
  const emoji = Emoji.create(
    {
      name: 'Unified',
      category: 'Category',
      unified: '1F601',
      char: '😅',

      ...override,
    },
    id,
  )

  return emoji
}

@Injectable()
export class EmojiFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaEmoji(data: Partial<EmojiProps> = {}): Promise<Emoji> {
    const emoji = makeEmoji(data)

    await this.prisma.emoji.create({
      data: PrismaEmojiMapper.toPrisma(emoji),
    })

    return emoji
  }
}
