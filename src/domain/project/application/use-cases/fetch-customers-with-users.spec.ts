import { InMemoryCustomerRepository } from 'test/repositories/in-memory-customer-repository'
import { FetchCustomersWithUsersUseCase } from './fetch-customers-with-users'
import { makeCustomer } from 'test/factories/make-customer'
import { makeUser } from 'test/factories/make-user'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

let inMemoryCustomerRepository: InMemoryCustomerRepository
let sut: FetchCustomersWithUsersUseCase

describe('Fetch Customers With Users', () => {
  beforeEach(() => {
    inMemoryCustomerRepository = new InMemoryCustomerRepository()
    sut = new FetchCustomersWithUsersUseCase(inMemoryCustomerRepository)
  })

  it('should be able to fetch customers with their users', async () => {
    const user1 = makeUser()
    const user2 = makeUser()
    const user3 = makeUser()
    const user4 = makeUser()

    const customer1 = makeCustomer({
      users: [user1],
    })
    const customer2 = makeCustomer({
      users: [user2],
    })
    const customer3 = makeCustomer({
      users: [user3],
    })
    const customer4 = makeCustomer({
      users: [user4],
    })

    await inMemoryCustomerRepository.create(customer1)
    await inMemoryCustomerRepository.create(customer2)
    await inMemoryCustomerRepository.create(customer3)
    await inMemoryCustomerRepository.create(customer4)

    const result = await sut.execute({ page: 1, size: 10 })

    // console.log(result.value?.customersWithUsers)

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.customersWithUsers).toHaveLength(4)
      expect(result.value.customersWithUsers[0].users).toContainEqual(user1)
      expect(result.value.customersWithUsers[1].users).toContainEqual(user2)
    }
  })
})
