import { InMemoryCustomerRepository } from 'test/repositories/in-memory-customer-repository'
import { InMemoryUserRepository } from 'test/repositories/in-memory-users-repository'
import { CreateUserUseCase } from './create-user'
import { FakeHasher } from 'test/cryptography/fake-hasher'
import { makeCustomer } from 'test/factories/make-customer'
import { makeUser } from 'test/factories/make-user'

let inMemoryUserRepository: InMemoryUserRepository
let inMemoryCustomerRepository: InMemoryCustomerRepository
let sut: CreateUserUseCase
let fakeHasher: FakeHasher

describe('Create new user', () => {
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRepository()
    inMemoryCustomerRepository = new InMemoryCustomerRepository()
    fakeHasher = new FakeHasher()
    sut = new CreateUserUseCase(inMemoryUserRepository, fakeHasher)
  })

  it('should be able to register a new User', async () => {
    const customer = makeCustomer()

    const newCustomer = await inMemoryCustomerRepository.create(customer)

    const user = makeUser()
    const result = await sut.execute({
      firstName: user.firstName,
      email: user.email,
      lastName: user.lastName,
      password: user.password,
      customerId: newCustomer.id.toString(),
      role: 'CLIENT_USER',
    })

    expect(result.isRight()).toBe(true)
  })
})
