import { Comments as PrismaComment, Prisma } from '@prisma/client'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Comment } from '@/domain/project/enterprise/entities/Comment'

export class PrismaCommentMapper {
  static toDomain(raw: PrismaComment): Comment {
    return Comment.create(
      {
        content: raw.content,
        status: raw.status,
        createdAt: raw.createdAt,
        projectUpdateId: new UniqueEntityID(raw.projectUpdateId),
        authorId: new UniqueEntityID(raw.authorId),
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(comment: Comment): Prisma.CommentsUncheckedCreateInput {
    return {
      id: comment.id.toString(),
      content: comment.content,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
      status: comment.status,
      authorId: comment.authorId?.toString(),
      projectUpdateId: comment.projectUpdateId.toString(),
    }
  }
}
