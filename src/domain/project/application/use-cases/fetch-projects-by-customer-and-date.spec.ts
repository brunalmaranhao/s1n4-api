import { InMemoryProjectRepository } from 'test/repositories/in-memory-project-repository'
import { makeProject } from 'test/factories/make-project'
import { FetchProjectByDateAndCustomerUseCase } from './fetch-projects-by-customer-and-date'
import { InMemoryCustomerRepository } from 'test/repositories/in-memory-customer-repository'
import { makeCustomer } from 'test/factories/make-customer'

let inMemoryProjectRepository: InMemoryProjectRepository
let inMemoryCustomerRepository: InMemoryCustomerRepository
let sut: FetchProjectByDateAndCustomerUseCase

describe('Fetch projects by date and customer', () => {
  beforeEach(() => {
    inMemoryProjectRepository = new InMemoryProjectRepository()
    inMemoryCustomerRepository = new InMemoryCustomerRepository()
    sut = new FetchProjectByDateAndCustomerUseCase(inMemoryProjectRepository)
  })

  it('should be able to fetch projects by status', async () => {
    const customer = makeCustomer()
    const projects = [
      makeProject({
        status: 'ACTIVE',
        start: new Date(),
        deadline: new Date('2025-02-17'),
        customerId: customer.id,
      }),
      makeProject({ status: 'INACTIVE' }),
    ]

    projects.forEach((project) => inMemoryProjectRepository.create(project))
    inMemoryCustomerRepository.create(customer)

    const result = await sut.execute({
      startDate: new Date('2025-01-17'),
      endDate: new Date('2027-01-21'),
      customerId: customer.id.toString(),
    })

    console.log(result.value)

    expect(result.isRight()).toBe(true)
    expect(Array.isArray(result.value?.projects)).toBe(true)
    expect(result.value?.projects).toHaveLength(1)
    result.value?.projects.forEach((project) => {
      expect(project.status).toEqual('ACTIVE')
    })
  })
})
