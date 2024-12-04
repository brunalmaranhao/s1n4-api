import { InMemoryCustomerRepository } from 'test/repositories/in-memory-customer-repository'
import { ValidateCustomerUseCase } from './validate-customer'
import { makeCustomer } from 'test/factories/make-customer'

let inMemoryCustomerRepository: InMemoryCustomerRepository
let sut: ValidateCustomerUseCase

describe('Validate new customer', () => {
  beforeEach(() => {
    inMemoryCustomerRepository = new InMemoryCustomerRepository()
    sut = new ValidateCustomerUseCase(inMemoryCustomerRepository)
  })

  it('should be able to validate a new Customer', async () => {
    const customer = makeCustomer()

    await inMemoryCustomerRepository.create(customer)
    const result = await sut.execute({
      name: customer.name,
      corporateName: customer.corporateName,
      cnpj: customer.cnpj,
    })

    expect(result.isLeft()).toBe(true)
  })
})
