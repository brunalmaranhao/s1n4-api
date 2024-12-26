import { Either, left, right } from '@/core/either'
import { ForbiddenException, Injectable } from '@nestjs/common'
import { CommentNotFoundError } from './errors/comment-not-found'
import { CommentRepository } from '../repositories/comment-repository'
import { Comment } from '../../enterprise/entities/comment'

interface UpdateCommentUseCaseRequest {
  id: string
  content: string
  authorId: string
}

type UpdateCommentUseCaseResponse = Either<
  CommentNotFoundError | ForbiddenException,
  {
    comment: Comment
  }
>

@Injectable()
export class UpdateCommentUseCase {
  constructor(private commentRepository: CommentRepository) {}

  async execute({
    id,
    content,
    authorId,
  }: UpdateCommentUseCaseRequest): Promise<UpdateCommentUseCaseResponse> {
    const commentExists = await this.commentRepository.findById(id)

    if (!commentExists) {
      return left(new CommentNotFoundError())
    }

    if (commentExists.authorId.toString() !== authorId) {
      return left(new ForbiddenException('Acesso negado'))
    }

    const updatedComment = await this.commentRepository.update(id, content)

    return right({
      comment: updatedComment,
    })
  }
}
