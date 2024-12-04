import { InMemoryCustomerRepository } from 'test/repositories/in-memory-customer-repository'
import { makeCustomer } from 'test/factories/make-customer'
import { FetchCostumersByStatusUseCase } from './fetch-costumers-by-status'
import { InMemoryUserRepository } from 'test/repositories/in-memory-users-repository'
import { FetchCustomerUsersUseCase } from './fetch-customer-users'
import { makeUser } from 'test/factories/make-user'
import { FetchCustomerResponsiblePartiesUseCase } from './fetch-customer-responsible-parties'
import { InMemoryResponsiblePartiesRepository } from 'test/repositories/in-memory-responsible-parties'
import { makeResponsibleParties } from 'test/factories/make-responsible-parties'

let inMemoryResponsiblePartiesRepository: InMemoryResponsiblePartiesRepository
let inMemoryCustomerRepository: InMemoryCustomerRepository
let inMemoryUserRepository: InMemoryUserRepository
let sut: FetchCustomerResponsiblePartiesUseCase

describe('Fetch customer responsible parties', () => {
  beforeEach(() => {
    inMemoryCustomerRepository = new InMemoryCustomerRepository()
    inMemoryUserRepository = new InMemoryUserRepository()
    inMemoryResponsiblePartiesRepository =
      new InMemoryResponsiblePartiesRepository()
    sut = new FetchCustomerResponsiblePartiesUseCase(
      inMemoryCustomerRepository,
      inMemoryResponsiblePartiesRepository,
    )
  })

  it('should be able to fetch customer responsible parties', async () => {
    const customer = makeCustomer()

    const responsible1 = makeResponsibleParties({ customerId: customer.id })
    const responsible2 = makeResponsibleParties({ customerId: customer.id })
    const responsible3 = makeResponsibleParties({ customerId: customer.id })
    const responsible4 = makeResponsibleParties({ customerId: customer.id })

    await inMemoryCustomerRepository.create(customer)

    await inMemoryResponsiblePartiesRepository.create(responsible1)
    await inMemoryResponsiblePartiesRepository.create(responsible2)
    await inMemoryResponsiblePartiesRepository.create(responsible3)
    await inMemoryResponsiblePartiesRepository.create(responsible4)

    const result = await sut.execute({
      customerId: customer.id.toString(),
      page: 1,
    })

    if (result.isRight()) {
      expect(result.value?.responsibleParties).toHaveLength(4)
      result.value.responsibleParties.map((responsible) => {
        return expect(responsible.customerId?.toString()).toEqual(
          customer.id.toString(),
        )
      })
    }
  })
})
