import { Either, left, right } from '@/core/either'
import { ForbiddenException, Injectable } from '@nestjs/common'
import { ReactionRepository } from '../repositories/reaction-repository'
import { ReactionNotFoundError } from './errors/reaction-not-found-error'

export type NullableType<T> = T | null

interface RemoveReactionCommentUseCaseRequest {
  commentId: string
  userId: string
}

type RemoveReactionCommentUseCaseResponse = Either<
  ReactionNotFoundError | ForbiddenException,
  null
>

@Injectable()
export class RemoveReactionCommentUseCase {
  constructor(private reactionRepository: ReactionRepository) {}

  async execute({
    commentId,
    userId,
  }: RemoveReactionCommentUseCaseRequest): Promise<RemoveReactionCommentUseCaseResponse> {
    const existingReaction = await this.reactionRepository.findByCommentAndUser(
      commentId,
      userId,
    )
    if (!existingReaction) {
      return left(new ReactionNotFoundError())
    }

    if (existingReaction.userId.toString() !== userId) {
      return left(new ForbiddenException('Acesso negado'))
    }

    await this.reactionRepository.remove(existingReaction.id.toString())

    return right(null)
  }
}
