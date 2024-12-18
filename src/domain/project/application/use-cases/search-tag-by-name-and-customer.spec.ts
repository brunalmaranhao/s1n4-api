import { InMemoryTagRepository } from 'test/repositories/in-memory-tag-repository'
import { makeTag } from 'test/factories/make-tag'
import { InMemoryCustomerRepository } from 'test/repositories/in-memory-customer-repository'
import { makeCustomer } from 'test/factories/make-customer'
import { SearchTagByNameAndCustomerUseCase } from './search-tag-by-name-and-customer'

let inMemoryTagRepository: InMemoryTagRepository
let inMemoryCustomerRepository: InMemoryCustomerRepository
let sut: SearchTagByNameAndCustomerUseCase

describe('Search Tags by Name and Customer', () => {
  beforeEach(() => {
    inMemoryTagRepository = new InMemoryTagRepository()
    inMemoryCustomerRepository = new InMemoryCustomerRepository()
    sut = new SearchTagByNameAndCustomerUseCase(inMemoryTagRepository)
  })

  it('should be able to search tags by partial name and customer', async () => {
    const customer = makeCustomer()
    await inMemoryCustomerRepository.create(customer)

    const customer2 = makeCustomer()
    await inMemoryCustomerRepository.create(customer2)

    const tag1 = makeTag({
      customerId: customer.id,
      name: 'Development',
    })

    const tag2 = makeTag({
      customerId: customer.id,
      name: 'DevOps',
    })

    const tag3 = makeTag({
      customerId: customer.id,
      name: 'Marketing',
    })

    const tag4 = makeTag({
      customerId: customer2.id,
      name: 'Design',
    })

    await inMemoryTagRepository.create(tag1)
    await inMemoryTagRepository.create(tag2)
    await inMemoryTagRepository.create(tag3)
    await inMemoryTagRepository.create(tag4)

    const result = await sut.execute({
      name: 'dev',
      customerId: customer.id.toString(),
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value?.tags).toHaveLength(2)
      expect(result.value?.tags).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ name: 'Development' }),
          expect.objectContaining({ name: 'DevOps' }),
        ]),
      )
    }
  })
})
