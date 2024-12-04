import { InMemoryResponsiblePartiesRepository } from 'test/repositories/in-memory-responsible-parties'
import { makeResponsibleParties } from 'test/factories/make-responsible-parties'
import { FetchResponsibleBirthdaysOfTheMonthUseCase } from './fetch-responsible-birthdays-of-the-month'

let inMemoryResponsiblePartiesRepository: InMemoryResponsiblePartiesRepository
let sut: FetchResponsibleBirthdaysOfTheMonthUseCase

describe('Fetch responsibles birthdays of the day', () => {
  beforeEach(() => {
    inMemoryResponsiblePartiesRepository =
      new InMemoryResponsiblePartiesRepository()
    sut = new FetchResponsibleBirthdaysOfTheMonthUseCase(
      inMemoryResponsiblePartiesRepository,
    )
  })

  it('should be able to fetch responsibles birthdays of the month', async () => {
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

    // console.log(result.value?.responsiblesBirthdayOfTheMonth);

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      responsiblesBirthdayOfTheMonth: expect.arrayContaining([
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
