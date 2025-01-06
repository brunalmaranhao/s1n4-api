import { Reaction } from './../../../../domain/project/enterprise/entities/reaction'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { PrismaReactionMapper } from '../mappers/prisma-reaction-mapper'
import { ReactionRepository } from '@/domain/project/application/repositories/reaction-repository'

@Injectable()
export class PrismaReactionRepository implements ReactionRepository {
  constructor(private prisma: PrismaService) {}
  async findByProjectUpdateAndUser(
    projectUpdateId: string,
    userId: string,
  ): Promise<Reaction | null> {
    const reaction = await this.prisma.reaction.findFirst({
      where: {
        projectUpdateId,
        userId,
      },
    })

    if (!reaction) return null

    return PrismaReactionMapper.toDomain(reaction)
  }

  async findByCommentAndUser(
    commentId: string,
    userId: string,
  ): Promise<Reaction | null> {
    const reaction = await this.prisma.reaction.findFirst({
      where: {
        commentId,
        userId,
      },
    })

    if (!reaction) return null

    return PrismaReactionMapper.toDomain(reaction)
  }

  async findByProjectUpdateId(projectUpdateId: string): Promise<Reaction[]> {
    const reactions = await this.prisma.reaction.findMany({
      where: {
        projectUpdateId,
      },
    })

    return reactions.map(PrismaReactionMapper.toDomain)
  }

  async findById(id: string): Promise<Reaction | null> {
    const reaction = await this.prisma.reaction.findUnique({
      where: {
        id,
      },
    })

    if (!reaction) {
      return null
    }

    return PrismaReactionMapper.toDomain(reaction)
  }

  async create(reaction: Reaction): Promise<Reaction> {
    const data = PrismaReactionMapper.toPrisma(reaction)

    const newReaction = await this.prisma.reaction.create({
      data,
      include: {
        user: true,
        emoji: true,
      },
    })

    return PrismaReactionMapper.toDomain(newReaction)
  }

  async remove(id: string): Promise<void> {
    await this.prisma.reaction.delete({
      where: {
        id,
      },
    })
  }
}
