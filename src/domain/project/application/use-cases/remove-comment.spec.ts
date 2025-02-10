import { InMemoryCommentRepository } from 'test/repositories/in-memory-comment-repository'
import { RemoveCommentUseCase } from './remove-comment'
import { makeComment } from 'test/factories/make-comment'
import { InMemoryUserRepository } from 'test/repositories/in-memory-users-repository'
import { makeUser } from 'test/factories/make-user'

let inMemoryUserRepository: InMemoryUserRepository
let inMemoryCommentRepository: InMemoryCommentRepository
let sut: RemoveCommentUseCase

describe('Remove Comment', () => {
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRepository()
    inMemoryCommentRepository = new InMemoryCommentRepository()

    sut = new RemoveCommentUseCase(inMemoryCommentRepository)
  })

  it('should change status to canceled when removing an active Comment', async () => {
    const user = makeUser()
    const comment = makeComment({
      authorId: user.id,
    })

    inMemoryCommentRepository.create(comment)

    const result = await sut.execute({
      id: comment.id.toString(),
      authorId: user.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toBeNull()
    expect(inMemoryCommentRepository.items[0].status).toBe('INACTIVE')
  })
})
