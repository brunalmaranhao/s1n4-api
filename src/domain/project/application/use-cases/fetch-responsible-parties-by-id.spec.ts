import { FetchResponsiblePartiesByIdUseCase } from './fetch-responsible-parties-by-id'
import { InMemoryResponsiblePartiesRepository } from 'test/repositories/in-memory-responsible-parties'
import { makeResponsibleParties } from 'test/factories/make-responsible-parties'

let inMemoryResponsiblePartiesRepository: InMemoryResponsiblePartiesRepository
let sut: FetchResponsiblePartiesByIdUseCase

describe('Fetch responsible parties by id', () => {
  beforeEach(() => {
    inMemoryResponsiblePartiesRepository =
      new InMemoryResponsiblePartiesRepository()
    sut = new FetchResponsiblePartiesByIdUseCase(
      inMemoryResponsiblePartiesRepository,
    )
  })

  it('should be able to fetch responsible parties by id', async () => {
    const responsible = makeResponsibleParties()

    inMemoryResponsiblePartiesRepository.create(responsible)

    const result = await sut.execute({
      id: responsible.id.toString(),
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.responsible.id.toString()).toEqual(
        responsible.id.toString(),
      )
    }
  })
})
