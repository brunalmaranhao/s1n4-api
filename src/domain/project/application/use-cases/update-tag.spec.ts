import { InMemoryTagRepository } from 'test/repositories/in-memory-tag-repository'
import { UpdateTagUseCase } from './update-tag'
import { makeTag } from 'test/factories/make-tag'

let inMemoryTagRepository: InMemoryTagRepository
let sut: UpdateTagUseCase

describe('Update Tag', () => {
  beforeEach(() => {
    inMemoryTagRepository = new InMemoryTagRepository()

    sut = new UpdateTagUseCase(inMemoryTagRepository)
  })

  it('should be able to edit a Tag', async () => {
    const tag = makeTag()

    await inMemoryTagRepository.create(tag)

    const result = await sut.execute({
      id: tag.id.toString(),
      tag: {
        name: 'Novo nome da tag',
        color: '#FFFFFF',
      },
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.tag.name).toEqual('Novo nome da tag')
      expect(result.value.tag.color).toEqual('#FFFFFF')
    }
  })
})
