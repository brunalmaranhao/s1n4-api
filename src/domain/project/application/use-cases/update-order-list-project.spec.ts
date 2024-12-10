import { InMemoryListProjectsRepository } from 'test/repositories/in-memory-list-project-repository'
import { makeListProject } from 'test/factories/make-list-project-repository'
import { UpdateOrderListProjectUseCase } from './update-order-list-project'
import { InMemoryCustomerRepository } from 'test/repositories/in-memory-customer-repository'
import { makeCustomer } from 'test/factories/make-customer'

let inMemoryListProjectRepository: InMemoryListProjectsRepository
let inMemoryCustomerRepository: InMemoryCustomerRepository
let sut: UpdateOrderListProjectUseCase

describe('Update Order List Project', () => {
  beforeEach(() => {
    inMemoryListProjectRepository = new InMemoryListProjectsRepository()
    inMemoryCustomerRepository = new InMemoryCustomerRepository()

    sut = new UpdateOrderListProjectUseCase(inMemoryListProjectRepository)
  })

  it('should be able to edit a Order List Project', async () => {
    const customer = makeCustomer()
    await inMemoryCustomerRepository.create(customer)
    const listProject1 = makeListProject({
      order: 1,
      customerId: customer.id,
    })
    const listProject2 = makeListProject({
      order: 2,
      customerId: customer.id,
    })
    const listProject3 = makeListProject({
      order: 3,
      customerId: customer.id,
    })

    await inMemoryListProjectRepository.create(listProject1)
    await inMemoryListProjectRepository.create(listProject2)
    await inMemoryListProjectRepository.create(listProject3)

    const orderData = [
      {
        id: listProject1.id.toString(),
        order: 3,
      },
      {
        id: listProject2.id.toString(),
        order: 1,
      },
      {
        id: listProject3.id.toString(),
        order: 2,
      },
    ]

    const result = await sut.execute({
      orderData,
    })

    expect(result.isRight()).toBe(true)

    const listProjects = await inMemoryListProjectRepository.findByCustomerId(
      customer.id.toString(),
    )
    console.log(listProjects)

    expect(listProjects).toEqual([
      expect.objectContaining({ id: listProject2.id, order: 1 }),
      expect.objectContaining({ id: listProject3.id, order: 2 }),
      expect.objectContaining({ id: listProject1.id, order: 3 }),
    ])
  })
})
