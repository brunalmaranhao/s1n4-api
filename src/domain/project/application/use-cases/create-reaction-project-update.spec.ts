import { InMemoryReactionRepository } from 'test/repositories/in-memory-reaction-repository'
import { InMemoryEmojiRepository } from 'test/repositories/in-memory-emoji-repository'
import { CreateReactionCommentUseCase } from './create-reaction-comment'
import { makeEmoji } from 'test/factories/make-emoji'
import { InMemoryCommentRepository } from 'test/repositories/in-memory-Comment-repository'
import { InMemoryUserRepository } from 'test/repositories/in-memory-users-repository'
import { makeUser } from 'test/factories/make-user'
import { makeComment } from 'test/factories/make-comment'
import { InMemoryProjectUpdateRepository } from 'test/repositories/in-memory-project-updates-repository'
import { makeProjectUpdates } from 'test/factories/make-project-updates'
import { CreateReactionProjectUpdateUseCase } from './create-reaction-project-update'

let inMemoryProjectUpdateRepository: InMemoryProjectUpdateRepository
let inMemoryCommentRepository: InMemoryCommentRepository
let inMemoryUserRepository: InMemoryUserRepository
let inMemoryReactionRepository: InMemoryReactionRepository
let inMemoryEmojiRepository: InMemoryEmojiRepository
let sut: CreateReactionProjectUpdateUseCase

describe('Create new Reaction Comment', () => {
  beforeEach(() => {
    inMemoryProjectUpdateRepository = new InMemoryProjectUpdateRepository()
    inMemoryEmojiRepository = new InMemoryEmojiRepository()
    inMemoryReactionRepository = new InMemoryReactionRepository()
    inMemoryCommentRepository = new InMemoryCommentRepository()
    inMemoryUserRepository = new InMemoryUserRepository()
    sut = new CreateReactionProjectUpdateUseCase(
      inMemoryReactionRepository,
      inMemoryEmojiRepository,
    )
  })

  it('should be able to register a new reaction project update', async () => {
    const emoji = makeEmoji()
    await inMemoryEmojiRepository.create(emoji)

    const user = makeUser()
    await inMemoryUserRepository.create(user)

    const projectUpdate = makeProjectUpdates()
    await inMemoryProjectUpdateRepository.create(projectUpdate)

    const comment = makeComment({
      projectUpdateId: projectUpdate.id,
    })
    await inMemoryCommentRepository.create(comment)

    const result = await sut.execute({
      projectUpdateId: projectUpdate.id.toString(),
      userId: user.id.toString(),
      unified: emoji.unified,
    })
    console.log('resultado')
    console.log(result)

    expect(result.isRight()).toBe(true)
  })
})
