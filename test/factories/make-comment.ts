import { faker } from '@faker-js/faker'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { PrismaCommentMapper } from '@/infra/database/prisma/mappers/prisma-Comment-mapper'
import {
  Comment,
  CommentProps,
} from '@/domain/project/enterprise/entities/comment'

export function makeComment(
  override: Partial<CommentProps> = {},
  id?: UniqueEntityID,
) {
  const comment = Comment.create(
    {
      content: faker.lorem.text(),
      status: 'ACTIVE',
      authorId: new UniqueEntityID('123'),
      projectUpdateId: new UniqueEntityID('123'),
      createdAt: new Date(),
      ...override,
    },
    id,
  )

  return comment
}

@Injectable()
export class CommentFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaComment(data: Partial<CommentProps> = {}): Promise<Comment> {
    const comment = makeComment(data)

    await this.prisma.comments.create({
      data: PrismaCommentMapper.toPrisma(comment),
    })

    return comment
  }
}
