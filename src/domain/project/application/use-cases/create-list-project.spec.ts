import { CreateListProjectUseCase } from './create-list-project'
import { InMemoryListProjectsRepository } from 'test/repositories/in-memory-list-project-repository'
import { InMemoryCustomerRepository } from 'test/repositories/in-memory-customer-repository'
import { makeCustomer } from 'test/factories/make-customer'

let inMemoryListProjectRepository: InMemoryListProjectsRepository
let inMemoryCustomerRepository: InMemoryCustomerRepository
let sut: CreateListProjectUseCase

describe('Create new List Project', () => {
  beforeEach(() => {
    inMemoryListProjectRepository = new InMemoryListProjectsRepository()
    inMemoryCustomerRepository = new InMemoryCustomerRepository()
    sut = new CreateListProjectUseCase(inMemoryListProjectRepository)
  })

  it('should be able to register a new List Project', async () => {
    const customer = makeCustomer()
    await inMemoryCustomerRepository.create(customer)

    const result = await sut.execute({
      customerId: customer.id.toString(),
      name: 'Em andamento',
    })

    expect(result.isRight()).toBe(true)
  })
})
