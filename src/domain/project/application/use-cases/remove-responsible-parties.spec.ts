import { InMemoryResponsiblePartiesRepository } from 'test/repositories/in-memory-responsible-parties'
import { RemoveResponsiblePartiesUseCase } from './remove-responsible-parties'
import { makeResponsibleParties } from 'test/factories/make-responsible-parties'

let inMemoryResponsiblePartiesRepository: InMemoryResponsiblePartiesRepository
let sut: RemoveResponsiblePartiesUseCase

describe('Remove ResponsibleParties', () => {
  beforeEach(() => {
    inMemoryResponsiblePartiesRepository =
      new InMemoryResponsiblePartiesRepository()

    sut = new RemoveResponsiblePartiesUseCase(
      inMemoryResponsiblePartiesRepository,
    )
  })

  it('should change status to inactive when removing an active ResponsibleParties', async () => {
    const activeResponsibleParties = makeResponsibleParties()

    const responsibleParties =
      await inMemoryResponsiblePartiesRepository.create(
        activeResponsibleParties,
      )

    const result = await sut.execute({
      id: responsibleParties.id.toString(),
    })

    // console.log(inMemoryResponsiblePartiesRepository.items[0])

    expect(result.isRight()).toBe(true)
    expect(result.value).toBeNull()
    expect(inMemoryResponsiblePartiesRepository.items[0].status).toBe(
      'INACTIVE',
    )
  })
})
