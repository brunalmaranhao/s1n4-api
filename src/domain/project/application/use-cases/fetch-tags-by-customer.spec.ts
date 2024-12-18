import { InMemoryTagRepository } from 'test/repositories/in-memory-tag-repository'
import { FetchTagsByCustomerUseCase } from './fetch-tags-by-customer'
import { makeTag } from 'test/factories/make-tag'
import { InMemoryCustomerRepository } from 'test/repositories/in-memory-customer-repository'
import { makeCustomer } from 'test/factories/make-customer'

let inMemoryTagRepository: InMemoryTagRepository
let inMemoryCustomerRepository: InMemoryCustomerRepository
let sut: FetchTagsByCustomerUseCase

describe('Fetch Tag by id', () => {
  beforeEach(() => {
    inMemoryTagRepository = new InMemoryTagRepository()
    inMemoryCustomerRepository = new InMemoryCustomerRepository()
    sut = new FetchTagsByCustomerUseCase(inMemoryTagRepository)
  })

  it('should be able to fetch Tag by id', async () => {
    const customer = makeCustomer()
    await inMemoryCustomerRepository.create(customer)
    const tag = makeTag({
      customerId: customer.id,
    })
    const tag2 = makeTag()

    inMemoryTagRepository.create(tag)
    inMemoryTagRepository.create(tag2)

    const result = await sut.execute({
      customer: tag.customerId.toString(),
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value?.tags).toHaveLength(1)
    }
  })
})
