import { InMemoryCustomerRepository } from 'test/repositories/in-memory-customer-repository'
import { CreateCustomerUseCase } from './create-customer'
import { CustomerProps } from '../../enterprise/entities/customer'

let inMemoryCustomerRepository: InMemoryCustomerRepository
let sut: CreateCustomerUseCase

describe('Create new customer', () => {
  beforeEach(() => {
    inMemoryCustomerRepository = new InMemoryCustomerRepository()
    sut = new CreateCustomerUseCase(inMemoryCustomerRepository)
  })

  it('should be able to register a new Customer', async () => {
    const newCustomer: CustomerProps = {
      name: 'Empresa Teste LTDA',
      corporateName: 'Empresa Teste',
      cnpj: '33.813.838/0001-53',
      status: 'ACTIVE',
    }
    const result = await sut.execute({ customer: newCustomer })

    expect(result.isRight()).toBe(true)
  })
})
