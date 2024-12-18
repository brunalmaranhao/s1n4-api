import { InMemoryTagRepository } from 'test/repositories/in-memory-tag-repository'
import { CreateTagUseCase } from './create-tag'
import { makeTag } from 'test/factories/make-tag'

let inMemoryTagRepository: InMemoryTagRepository
let sut: CreateTagUseCase

describe('Create new Tag', () => {
  beforeEach(() => {
    inMemoryTagRepository = new InMemoryTagRepository()
    sut = new CreateTagUseCase(inMemoryTagRepository)
  })

  it('should be able to register a new Tag', async () => {
    const tag = makeTag()

    const result = await sut.execute({
      customerId: tag.customerId.toString(),
      name: tag.name,
      color: tag.color,
    })

    expect(result.isRight()).toBe(true)
  })
})
