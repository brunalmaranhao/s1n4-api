import { InMemoryCustomerRepository } from 'test/repositories/in-memory-customer-repository'
import { InMemoryUserRepository } from 'test/repositories/in-memory-users-repository'
import { makeCustomer } from 'test/factories/make-customer'
import { makeUser } from 'test/factories/make-user'
import { CountUsersAndCustomersUseCase } from './count-users-and-customers'

let inMemoryUserRepository: InMemoryUserRepository
let inMemoryCustomerRepository: InMemoryCustomerRepository
let sut: CountUsersAndCustomersUseCase

describe('Create new user', () => {
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRepository()
    inMemoryCustomerRepository = new InMemoryCustomerRepository()
    sut = new CountUsersAndCustomersUseCase(
      inMemoryCustomerRepository,
      inMemoryUserRepository,
    )
  })

  it('should be able to register a new User', async () => {
    const customer = makeCustomer()

    const newCustomer = await inMemoryCustomerRepository.create(customer)

    const userWithCustomer = makeUser({
      customerId: newCustomer.id,
      role: 'CLIENT_OWNER',
    })

    const userAdmin = makeUser({
      role: 'INTERNAL_FINANCIAL_LEGAL',
    })

    await inMemoryUserRepository.create(userAdmin)
    await inMemoryUserRepository.create(userWithCustomer)

    const result = await sut.execute()
    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({ totalCustomers: 1, totalUsers: 1 })
  })
})
