import { InMemoryCustomerRepository } from 'test/repositories/in-memory-customer-repository'
import { makeCustomer } from 'test/factories/make-customer'
import { FetchCostumersByStatusWithoutPaginationUseCase } from './fetch-costumers-by-status-without-pagination'

let inMemoryCustomerRepository: InMemoryCustomerRepository
let sut: FetchCostumersByStatusWithoutPaginationUseCase

describe('Fetch active customers', () => {
  beforeEach(() => {
    inMemoryCustomerRepository = new InMemoryCustomerRepository()
    sut = new FetchCostumersByStatusWithoutPaginationUseCase(
      inMemoryCustomerRepository,
    )
  })

  it('should be able to fetch active customers', async () => {
    const costumer = makeCustomer()

    await inMemoryCustomerRepository.create(costumer)

    const result = await sut.execute({ status: 'ACTIVE' })

    expect(result.value?.customers).toHaveLength(1)
  })
})
