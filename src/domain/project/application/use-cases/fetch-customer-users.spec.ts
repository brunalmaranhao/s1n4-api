import { InMemoryCustomerRepository } from 'test/repositories/in-memory-customer-repository'
import { makeCustomer } from 'test/factories/make-customer'
import { FetchCostumersByStatusUseCase } from './fetch-costumers-by-status'
import { InMemoryUserRepository } from 'test/repositories/in-memory-users-repository'
import { FetchCustomerUsersUseCase } from './fetch-customer-users'
import { makeUser } from 'test/factories/make-user'

let inMemoryCustomerRepository: InMemoryCustomerRepository
let inMemoryUserRepository: InMemoryUserRepository
let sut: FetchCustomerUsersUseCase

describe('Fetch customer users', () => {
  beforeEach(() => {
    inMemoryCustomerRepository = new InMemoryCustomerRepository()
    inMemoryUserRepository = new InMemoryUserRepository()
    sut = new FetchCustomerUsersUseCase(
      inMemoryCustomerRepository,
      inMemoryUserRepository,
    )
  })

  it('should be able to fetch customer users', async () => {
    const costumer = makeCustomer()

    const user1 = makeUser({ customerId: costumer.id })
    const user2 = makeUser({ customerId: costumer.id })
    const user3 = makeUser({ customerId: costumer.id })
    const user4 = makeUser({ customerId: costumer.id })

    await inMemoryCustomerRepository.create(costumer)

    await inMemoryUserRepository.create(user1)
    await inMemoryUserRepository.create(user2)
    await inMemoryUserRepository.create(user3)
    await inMemoryUserRepository.create(user4)

    const result = await sut.execute({
      customerId: costumer.id.toString(),
      page: 1,
    })

    if (result.isRight()) {
      expect(result.value?.users).toHaveLength(4)
      result.value.users.map((user) => {
        return expect(user.customerId?.toString()).toEqual(
          costumer.id.toString(),
        )
      })
    }
  })
})
