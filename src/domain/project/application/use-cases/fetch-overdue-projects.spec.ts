import { InMemoryProjectRepository } from 'test/repositories/in-memory-project-repository'
import { makeProject } from 'test/factories/make-project'
import { InMemoryCustomerRepository } from 'test/repositories/in-memory-customer-repository'
import { makeCustomer } from 'test/factories/make-customer'
import { FetchOverdueProjectsUseCase } from './fetch-overdue-projects'

let inMemoryProjectRepository: InMemoryProjectRepository
let inMemoryCustomerRepository: InMemoryCustomerRepository
let sut: FetchOverdueProjectsUseCase

describe('Fetch projects by date and customer', () => {
  beforeEach(() => {
    inMemoryProjectRepository = new InMemoryProjectRepository()
    inMemoryCustomerRepository = new InMemoryCustomerRepository()
    sut = new FetchOverdueProjectsUseCase(inMemoryProjectRepository)
  })

  it('should be able to fetch overdue projects', async () => {
    const customer = makeCustomer()
    const customer2 = makeCustomer({
      cnpj: '000000000/0001',
    })
    const projects = [
      makeProject({
        status: 'ACTIVE',
        start: new Date(),
        deadline: new Date('2025-02-17'),
        customerId: customer.id,
      }),
      makeProject({ status: 'INACTIVE' }),
      makeProject({
        status: 'ACTIVE',
        start: new Date(),
        deadline: new Date('2025-01-26'),
        customerId: customer.id,
      }),
      makeProject({
        status: 'ACTIVE',
        start: new Date(),
        deadline: new Date('2025-01-26'),
        customerId: customer2.id,
      }),
    ]

    projects.forEach((project) => inMemoryProjectRepository.create(project))
    inMemoryCustomerRepository.create(customer)

    const result = await sut.execute({
      date: new Date(),
    })

    expect(result.isRight()).toBe(true)
    expect(Array.isArray(result.value?.projects)).toBe(true)
    expect(result.value?.projects).toHaveLength(2)
    result.value?.projects.forEach((project) => {
      expect(project.status).toEqual('ACTIVE')
    })
  })
})
