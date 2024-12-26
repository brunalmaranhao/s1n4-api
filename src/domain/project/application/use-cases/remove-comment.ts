import { Either, left, right } from '@/core/either'
import { ForbiddenException, Injectable } from '@nestjs/common'
import { CommentRepository } from '../repositories/comment-repository'
import { CommentNotFoundError } from './errors/comment-not-found'

interface RemoveCommentUseCaseRequest {
  id: string
  authorId: string
}

type RemoveCommentUseCaseResponse = Either<
  CommentNotFoundError | ForbiddenException,
  null
>

@Injectable()
export class RemoveCommentUseCase {
  constructor(private commentRepository: CommentRepository) {}

  async execute({
    id,
    authorId,
  }: RemoveCommentUseCaseRequest): Promise<RemoveCommentUseCaseResponse> {
    const comment = await this.commentRepository.findById(id)

    if (!comment) {
      return left(new CommentNotFoundError())
    }

    if (comment.authorId.toString() !== authorId) {
      return left(new ForbiddenException('Acesso negado'))
    }

    await this.commentRepository.remove(id)

    return right(null)
  }
}
