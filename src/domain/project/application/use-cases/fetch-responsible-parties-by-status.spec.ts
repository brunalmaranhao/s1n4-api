import { InMemoryResponsiblePartiesRepository } from 'test/repositories/in-memory-responsible-parties'
import { FetchResponsiblePartiesByStatusUseCase } from './fetch-responsible-parties-by-status'
import { makeResponsibleParties } from 'test/factories/make-responsible-parties'

let inMemoryResponsiblePartiesRepository: InMemoryResponsiblePartiesRepository
let sut: FetchResponsiblePartiesByStatusUseCase

describe('Fetch active ResponsiblePartiess', () => {
  beforeEach(() => {
    inMemoryResponsiblePartiesRepository =
      new InMemoryResponsiblePartiesRepository()
    sut = new FetchResponsiblePartiesByStatusUseCase(
      inMemoryResponsiblePartiesRepository,
    )
  })

  it('should be able to fetch active ResponsiblePartiess', async () => {
    const responsibleParties = makeResponsibleParties()

    await inMemoryResponsiblePartiesRepository.create(responsibleParties)

    const result = await sut.execute({ status: 'ACTIVE', page: 1 })

    expect(result.value?.responsible).toHaveLength(1)
  })
})
