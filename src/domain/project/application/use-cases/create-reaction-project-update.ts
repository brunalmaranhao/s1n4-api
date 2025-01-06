import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { ReactionRepository } from '../repositories/reaction-repository'
import { Reaction } from '../../enterprise/entities/reaction'
import { EmojiRepository } from '../repositories/emoji-repository'
import { EmojiNotFoundError } from './errors/emoji-not-found-error'

export type NullableType<T> = T | null

interface CreateReactionProjectUpdateUseCaseRequest {
  unified: string
  userId: string
  projectUpdateId: string
}

type CreateReactionProjectUpdateUseCaseResponse = Either<
  EmojiNotFoundError,
  null
>

@Injectable()
export class CreateReactionProjectUpdateUseCase {
  constructor(
    private reactionRepository: ReactionRepository,
    private emojiRepository: EmojiRepository,
  ) {}

  async execute({
    unified,
    userId,
    projectUpdateId,
  }: CreateReactionProjectUpdateUseCaseRequest): Promise<CreateReactionProjectUpdateUseCaseResponse> {
    const emoji = await this.emojiRepository.findByUnified(unified)

    if (!emoji) {
      return left(new EmojiNotFoundError())
    }

    const reaction = await this.reactionRepository.findByProjectUpdateAndUser(
      projectUpdateId,
      userId,
    )

    if (reaction) {
      await this.reactionRepository.remove(reaction.id.toString())
    }

    const newReaction = Reaction.create({
      userId: new UniqueEntityID(userId),
      projectUpdateId: new UniqueEntityID(projectUpdateId),
      emojiId: emoji.id,
    })

    await this.reactionRepository.create(newReaction)

    return right(null)
  }
}
