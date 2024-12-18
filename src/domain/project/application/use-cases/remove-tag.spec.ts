import { InMemoryTagRepository } from 'test/repositories/in-memory-tag-repository'
import { RemoveTagUseCase } from './remove-tag'
import { makeTag } from 'test/factories/make-tag'

let inMemoryTagRepository: InMemoryTagRepository
let sut: RemoveTagUseCase

describe('Remove tag', () => {
  beforeEach(() => {
    inMemoryTagRepository = new InMemoryTagRepository()

    sut = new RemoveTagUseCase(inMemoryTagRepository)
  })

  it('should change status to canceled when removing an active Tag', async () => {
    const tag = makeTag()

    inMemoryTagRepository.create(tag)

    const result = await sut.execute({
      id: tag.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toBeNull()
    expect(inMemoryTagRepository.items[0].status).toBe('INACTIVE')
  })
})
