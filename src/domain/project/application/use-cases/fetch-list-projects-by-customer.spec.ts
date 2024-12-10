import { InMemoryCustomerRepository } from 'test/repositories/in-memory-customer-repository'
import { makeCustomer } from 'test/factories/make-customer'
import { InMemoryListProjectsRepository } from 'test/repositories/in-memory-list-project-repository'
import { FetchListProjectsByCustomerUseCase } from './fetch-list-projects-by-customer'
import { makeListProject } from 'test/factories/make-list-project-repository'

let inMemoryListProjectRepository: InMemoryListProjectsRepository
let inMemoryCustomerRepository: InMemoryCustomerRepository
let sut: FetchListProjectsByCustomerUseCase

describe('Fetch customer projects', () => {
  beforeEach(() => {
    inMemoryCustomerRepository = new InMemoryCustomerRepository()
    inMemoryListProjectRepository = new InMemoryListProjectsRepository()
    sut = new FetchListProjectsByCustomerUseCase(inMemoryListProjectRepository)
  })

  it('should be able to fetch customer projects', async () => {
    const customer = makeCustomer()

    const project1 = makeListProject({ customerId: customer.id })
    const project2 = makeListProject({ customerId: customer.id })
    const project3 = makeListProject({ customerId: customer.id })
    const project4 = makeListProject({ customerId: customer.id })

    await inMemoryCustomerRepository.create(customer)

    await Promise.all([
      inMemoryListProjectRepository.create(project1),
      inMemoryListProjectRepository.create(project2),
      inMemoryListProjectRepository.create(project3),
      inMemoryListProjectRepository.create(project4),
    ])

    const result = await sut.execute({
      customerId: customer.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value?.listProjects).toHaveLength(4)
      result.value.listProjects.map((project) => {
        return expect(project.customerId?.toString()).toEqual(
          customer.id.toString(),
        )
      })
    }
  })
})
