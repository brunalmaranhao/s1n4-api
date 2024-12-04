import { InMemoryCustomerRepository } from 'test/repositories/in-memory-customer-repository'
import { makeCustomer } from 'test/factories/make-customer'
import { FetchCustomerUseCase } from './fetch-customer-by-id'

let inMemoryCustomerRepository: InMemoryCustomerRepository
let sut: FetchCustomerUseCase

describe('Fetch customer', () => {
  beforeEach(() => {
    inMemoryCustomerRepository = new InMemoryCustomerRepository()
    sut = new FetchCustomerUseCase(inMemoryCustomerRepository)
  })

  it('should be able to fetch customer by id', async () => {
    const customer = makeCustomer()

    await inMemoryCustomerRepository.create(customer)

    const result = await sut.execute({ id: customer.id.toString() })
    expect(result.isRight()).toBe(true)
  })
})
