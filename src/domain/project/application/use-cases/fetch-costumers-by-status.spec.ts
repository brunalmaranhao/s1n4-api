import { InMemoryCustomerRepository } from 'test/repositories/in-memory-customer-repository'
import { makeCustomer } from 'test/factories/make-customer'
import { FetchCostumersByStatusUseCase } from './fetch-costumers-by-status'

let inMemoryCustomerRepository: InMemoryCustomerRepository
let sut: FetchCostumersByStatusUseCase

describe('Fetch active customers', () => {
  beforeEach(() => {
    inMemoryCustomerRepository = new InMemoryCustomerRepository()
    sut = new FetchCostumersByStatusUseCase(inMemoryCustomerRepository)
  })

  it('should be able to fetch active customers', async () => {
    const costumer = makeCustomer()

    await inMemoryCustomerRepository.create(costumer)

    const result = await sut.execute({ status: 'ACTIVE', page: 1 })

    expect(result.value?.customers).toHaveLength(1)
  })
})
