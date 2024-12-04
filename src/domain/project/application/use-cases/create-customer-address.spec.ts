import { CreateCustomerAddressUseCase } from './create-customer-address'
import { InMemoryCustomerAddressRepository } from 'test/repositories/in-memory-customer-address-repository'
import { makeCustomerAddress } from 'test/factories/make-customer-address'

let inMemoryCustomerAddressRepository: InMemoryCustomerAddressRepository
let sut: CreateCustomerAddressUseCase

describe('Create new customer address', () => {
  beforeEach(() => {
    inMemoryCustomerAddressRepository = new InMemoryCustomerAddressRepository()
    sut = new CreateCustomerAddressUseCase(inMemoryCustomerAddressRepository)
  })

  it('should be able to register a new Customer Address', async () => {
    const customerAddress = makeCustomerAddress()
    const result = await sut.execute({
      city: customerAddress.city,
      country: customerAddress.country,
      customerId: customerAddress.customerId.toString(),
      neighborhood: customerAddress.neighborhood,
      number: customerAddress.number,
      state: customerAddress.state,
      street: customerAddress.street,
      zipCode: customerAddress.zipCode,
    })

    expect(result.isRight()).toBe(true)
  })
})
