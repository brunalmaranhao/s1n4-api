import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  Reaction,
  ReactionProps,
} from '@/domain/project/enterprise/entities/reaction'
import { PrismaReactionMapper } from '@/infra/database/prisma/mappers/prisma-reaction-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { Injectable } from '@nestjs/common'

export function makeReaction(
  override: Partial<ReactionProps> = {},
  id?: UniqueEntityID,
) {
  const reaction = Reaction.create(
    {
      emojiId: new UniqueEntityID('12'),
      userId: new UniqueEntityID('12'),
      ...override,
    },
    id,
  )

  return reaction
}

@Injectable()
export class ReactionFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaReaction(
    data: Partial<ReactionProps> = {},
  ): Promise<Reaction> {
    const Reaction = makeReaction(data)

    await this.prisma.reaction.create({
      data: PrismaReactionMapper.toPrisma(Reaction),
    })

    return Reaction
  }
}
