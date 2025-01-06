import { Either, left, right } from '@/core/either'
import { ForbiddenException, Injectable } from '@nestjs/common'
import { ReactionRepository } from '../repositories/reaction-repository'
import { ReactionNotFoundError } from './errors/reaction-not-found-error'

export type NullableType<T> = T | null

interface RemoveReactionProjectUpdateUseCaseRequest {
  projectUpdateId: string
  userId: string
}

type RemoveReactionProjectUpdateUseCaseResponse = Either<
  ReactionNotFoundError | ForbiddenException,
  null
>

@Injectable()
export class RemoveReactionProjectUpdateUseCase {
  constructor(private reactionRepository: ReactionRepository) {}

  async execute({
    projectUpdateId,
    userId,
  }: RemoveReactionProjectUpdateUseCaseRequest): Promise<RemoveReactionProjectUpdateUseCaseResponse> {
    const existingReaction =
      await this.reactionRepository.findByProjectUpdateAndUser(
        projectUpdateId,
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
