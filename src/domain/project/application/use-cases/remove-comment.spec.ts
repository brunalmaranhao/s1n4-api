import { InMemoryCommentRepository } from 'test/repositories/in-memory-comment-repository'
import { RemoveCommentUseCase } from './remove-comment'
import { makeComment } from 'test/factories/make-comment'

let inMemoryCommentRepository: InMemoryCommentRepository
let sut: RemoveCommentUseCase

describe('Remove Comment', () => {
  beforeEach(() => {
    inMemoryCommentRepository = new InMemoryCommentRepository()

    sut = new RemoveCommentUseCase(inMemoryCommentRepository)
  })

  it('should change status to canceled when removing an active Comment', async () => {
    const Comment = makeComment()

    inMemoryCommentRepository.create(Comment)

    const result = await sut.execute({
      id: Comment.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toBeNull()
    expect(inMemoryCommentRepository.items[0].status).toBe('INACTIVE')
  })
})
