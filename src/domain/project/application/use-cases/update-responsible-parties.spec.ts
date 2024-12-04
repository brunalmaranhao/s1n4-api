import { InMemoryResponsiblePartiesRepository } from 'test/repositories/in-memory-responsible-parties'
import { UpdateResponsiblePartiesUseCase } from './update-responsible-parties'
import { makeResponsibleParties } from 'test/factories/make-responsible-parties'
import { ResponsiblePartiesEditProps } from '@/core/types/responsilbe-parties-props'

let inMemoryResponsiblePartiesRepository: InMemoryResponsiblePartiesRepository
let sut: UpdateResponsiblePartiesUseCase

describe('Update ResponsibleParties', () => {
  beforeEach(() => {
    inMemoryResponsiblePartiesRepository =
      new InMemoryResponsiblePartiesRepository()

    sut = new UpdateResponsiblePartiesUseCase(
      inMemoryResponsiblePartiesRepository,
    )
  })

  it('should be able to edit a ResponsibleParties', async () => {
    const email = 'novoemail@teste.com'

    const newResponsibleParties = makeResponsibleParties()

    await inMemoryResponsiblePartiesRepository.create(newResponsibleParties)
    const responsibleParties: ResponsiblePartiesEditProps = {
      email,
    }

    const result = await sut.execute({
      id: newResponsibleParties.id.toString(),
      responsibleParties,
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.responsibleParties.email).toEqual(email)
    }
  })
})
