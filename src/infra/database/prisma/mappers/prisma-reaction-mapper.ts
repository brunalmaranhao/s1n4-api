import { Reaction as PrismaReaction, Prisma } from '@prisma/client'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Reaction } from '@/domain/project/enterprise/entities/reaction'

export class PrismaReactionMapper {
  static toDomain(raw: PrismaReaction): Reaction {
    return Reaction.create(
      {
        userId: new UniqueEntityID(raw.userId),
        emojiId: new UniqueEntityID(raw.emojiId),
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
        status: raw.status,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(reaction: Reaction): Prisma.ReactionUncheckedCreateInput {
    return {
      id: reaction.id.toString(),
      userId: reaction.userId.toString(),
      emojiId: reaction.emojiId.toString(),
      commentId: reaction.commentId?.toString(),
      projectUpdateId: reaction.projectUpdateId?.toString(),
      createdAt: reaction.createdAt,
      updatedAt: reaction.updatedAt,
      status: reaction.status,
    }
  }
}
