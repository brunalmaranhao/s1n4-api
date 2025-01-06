import { Emoji } from './../../../../domain/project/enterprise/entities/emoji'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { PrismaEmojiMapper } from '../mappers/prisma-emoji-mapper'
import { EmojiRepository } from '@/domain/project/application/repositories/emoji-repository'

@Injectable()
export class PrismaEmojiRepository implements EmojiRepository {
  constructor(private prisma: PrismaService) {}

  async findByUnified(unified: string): Promise<Emoji | null> {
    const emoji = await this.prisma.emoji.findUnique({
      where: {
        unified: unified.toUpperCase(),
      },
    })

    if (!emoji) {
      return null
    }

    return PrismaEmojiMapper.toDomain(emoji)
  }

  async findById(id: string): Promise<Emoji | null> {
    const Emoji = await this.prisma.emoji.findUnique({
      where: {
        id,
      },
    })

    if (!Emoji) {
      return null
    }

    return PrismaEmojiMapper.toDomain(Emoji)
  }

  async create(emoji: Emoji): Promise<Emoji> {
    const data = PrismaEmojiMapper.toPrisma(emoji)

    const newEmoji = await this.prisma.emoji.create({
      data,
    })

    return PrismaEmojiMapper.toDomain(newEmoji)
  }
}
