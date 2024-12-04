import { InMemoryCustomerRepository } from 'test/repositories/in-memory-customer-repository'
import { RemoveCustomerUseCase } from './remove-customer'
import { makeCustomer } from 'test/factories/make-customer'

let inMemoryCustomerRepository: InMemoryCustomerRepository
let sut: RemoveCustomerUseCase

describe('Remove Customer', () => {
  beforeEach(() => {
    inMemoryCustomerRepository = new InMemoryCustomerRepository()

    sut = new RemoveCustomerUseCase(inMemoryCustomerRepository)
  })

  it('should change status to inactive when removing an active Customer', async () => {
    const activeCustomer = makeCustomer()

    const customer = await inMemoryCustomerRepository.create(activeCustomer)

    const result = await sut.execute({
      id: customer.id.toString(),
    })

    // console.log(inMemoryCustomerRepository.items[0])

    expect(result.isRight()).toBe(true)
    expect(result.value).toBeNull()
    expect(inMemoryCustomerRepository.items[0].status).toBe('INACTIVE')
  })
})
