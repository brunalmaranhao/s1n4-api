import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { CommentRepository } from '@/domain/project/application/repositories/comment-repository'
import { PrismaCommentMapper } from '../mappers/prisma-comment-mapper'
import { Comment } from '@/domain/project/enterprise/entities/comment'

@Injectable()
export class PrismaCommentRepository implements CommentRepository {
  constructor(private prisma: PrismaService) {}

  async remove(id: string): Promise<void> {
    await this.prisma.comments.update({
      where: {
        id,
      },
      data: {
        status: 'INACTIVE',
      },
    })
  }

  async update(commentId: string, content: string): Promise<Comment> {
    const updatedComment = await this.prisma.comments.update({
      where: {
        id: commentId,
      },
      data: {
        content,
        updatedAt: new Date(),
      },
    })

    return PrismaCommentMapper.toDomain(updatedComment)
  }

  async findById(id: string): Promise<Comment | null> {
    const expense = await this.prisma.comments.findUnique({
      where: {
        id,
      },
    })

    if (!expense) {
      return null
    }

    return PrismaCommentMapper.toDomain(expense)
  }

  async create(Comment: Comment): Promise<Comment> {
    const data = PrismaCommentMapper.toPrisma(Comment)

    const newExpense = await this.prisma.comments.create({
      data,
    })
    return PrismaCommentMapper.toDomain(newExpense)
  }
}
