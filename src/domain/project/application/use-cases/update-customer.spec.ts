import { InMemoryCustomerRepository } from 'test/repositories/in-memory-customer-repository'
import { UpdateCustomerUseCase } from './update-customer'
import { makeCustomer } from 'test/factories/make-customer'
import { CustomerEditProps } from '@/core/types/customer-props'

let inMemoryCustomerRepository: InMemoryCustomerRepository
let sut: UpdateCustomerUseCase

describe('Update customer', () => {
  beforeEach(() => {
    inMemoryCustomerRepository = new InMemoryCustomerRepository()

    sut = new UpdateCustomerUseCase(inMemoryCustomerRepository)
  })

  it('should be able to edit a customer', async () => {
    const address = 'Rua do melão'

    const newCustomer = makeCustomer()

    await inMemoryCustomerRepository.create(newCustomer)
    const customer: CustomerEditProps = {
      address,
    }

    const result = await sut.execute({
      id: newCustomer.id.toString(),
      customer,
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.customer.address).toEqual('Rua do melão')
    }
  })
})
