import { InMemoryResponsiblePartiesRepository } from 'test/repositories/in-memory-responsible-parties'
import { makeResponsibleParties } from 'test/factories/make-responsible-parties'
import { FetchResponsibleBirthdaysOfTheDayUseCase } from './fetch-responsible-birthdays-of-the-day'

let inMemoryResponsiblePartiesRepository: InMemoryResponsiblePartiesRepository
let sut: FetchResponsibleBirthdaysOfTheDayUseCase

describe('Fetch responsibles birthdays of the day', () => {
  beforeEach(() => {
    inMemoryResponsiblePartiesRepository =
      new InMemoryResponsiblePartiesRepository()
    sut = new FetchResponsibleBirthdaysOfTheDayUseCase(
      inMemoryResponsiblePartiesRepository,
    )
  })

  it('should be able to fetch responsibles birthdays of the day', async () => {
    const today = new Date()
    const month = today.getMonth() + 1
    const day = today.getDate()

    await Promise.all([
      inMemoryResponsiblePartiesRepository.create(
        makeResponsibleParties({ birthdate: new Date('05-10-1994') }),
      ),
      inMemoryResponsiblePartiesRepository.create(
        makeResponsibleParties({ birthdate: new Date('08-18-1994') }),
      ),
      inMemoryResponsiblePartiesRepository.create(
        makeResponsibleParties({ birthdate: new Date(`${month}-${day}-1990`) }),
      ),
      inMemoryResponsiblePartiesRepository.create(
        makeResponsibleParties({ birthdate: new Date(`${month}-${day}-1990`) }),
      ),
    ])

    const result = await sut.execute({
      page: 1,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.responsiblesBirthday).toHaveLength(2)
    expect(result.value).toEqual({
      responsiblesBirthday: expect.arrayContaining([
        expect.objectContaining({
          birthdate: new Date(`${month}-${day}-1990`),
        }),
        expect.objectContaining({
          birthdate: new Date(`${month}-${day}-1990`),
        }),
      ]),
    })
  })
})
