import { InMemoryReactionRepository } from 'test/repositories/in-memory-reaction-repository'
import { InMemoryEmojiRepository } from 'test/repositories/in-memory-emoji-repository'
import { CreateReactionCommentUseCase } from './create-reaction-comment'
import { makeEmoji } from 'test/factories/make-emoji'
import { InMemoryCommentRepository } from 'test/repositories/in-memory-Comment-repository'
import { InMemoryUserRepository } from 'test/repositories/in-memory-users-repository'
import { makeUser } from 'test/factories/make-user'
import { makeComment } from 'test/factories/make-comment'

let inMemoryCommentRepository: InMemoryCommentRepository
let inMemoryUserRepository: InMemoryUserRepository
let inMemoryReactionRepository: InMemoryReactionRepository
let inMemoryEmojiRepository: InMemoryEmojiRepository
let sut: CreateReactionCommentUseCase

describe('Create new Reaction Comment', () => {
  beforeEach(() => {
    inMemoryEmojiRepository = new InMemoryEmojiRepository()
    inMemoryReactionRepository = new InMemoryReactionRepository()
    inMemoryCommentRepository = new InMemoryCommentRepository()
    inMemoryUserRepository = new InMemoryUserRepository()
    sut = new CreateReactionCommentUseCase(
      inMemoryReactionRepository,
      inMemoryEmojiRepository,
    )
  })

  it('should be able to register a new reaction comment', async () => {
    const emoji = makeEmoji()
    await inMemoryEmojiRepository.create(emoji)

    const user = makeUser()
    await inMemoryUserRepository.create(user)

    const comment = makeComment()
    await inMemoryCommentRepository.create(comment)

    const result = await sut.execute({
      commentId: comment.id.toString(),
      userId: user.id.toString(),
      unified: emoji.unified,
    })

    expect(result.isRight()).toBe(true)
  })
})
