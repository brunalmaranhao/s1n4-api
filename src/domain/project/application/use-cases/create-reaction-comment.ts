import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { ReactionRepository } from '../repositories/reaction-repository'
import { Reaction } from '../../enterprise/entities/reaction'
import { EmojiRepository } from '../repositories/emoji-repository'
import { EmojiNotFoundError } from './errors/emoji-not-found-error'

export type NullableType<T> = T | null

interface CreateReactionCommentUseCaseRequest {
  unified: string
  userId: string
  commentId: string
}

type CreateReactionCommentUseCaseResponse = Either<EmojiNotFoundError, null>

@Injectable()
export class CreateReactionCommentUseCase {
  constructor(
    private reactionRepository: ReactionRepository,
    private emojiRepository: EmojiRepository,
  ) {}

  async execute({
    unified,
    userId,
    commentId,
  }: CreateReactionCommentUseCaseRequest): Promise<CreateReactionCommentUseCaseResponse> {
    const emoji = await this.emojiRepository.findByUnified(unified)

    if (!emoji) {
      return left(new EmojiNotFoundError())
    }

    const reaction = await this.reactionRepository.findByCommentAndUser(
      commentId,
      userId,
    )

    if (reaction) {
      await this.reactionRepository.remove(reaction.id.toString())
    }

    const newReaction = Reaction.create({
      userId: new UniqueEntityID(userId),
      commentId: new UniqueEntityID(commentId),
      emojiId: emoji.id,
    })

    await this.reactionRepository.create(newReaction)

    return right(null)
  }
}
