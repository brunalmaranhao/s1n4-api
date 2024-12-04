import { InMemoryPeriodicReportRepository } from 'test/repositories/in-memory-periodic-report'
import { CreatePeriodicReportUseCase } from './create-periodic-report'
import { InMemoryCustomerRepository } from 'test/repositories/in-memory-customer-repository'
import { makeCustomer } from 'test/factories/make-customer'
import { InMemoryProjectRepository } from 'test/repositories/in-memory-project-repository'
import { makeProject } from 'test/factories/make-project'

let inMemoryPeriodicReportRepository: InMemoryPeriodicReportRepository
let inMemoryCustomerRepository: InMemoryCustomerRepository
let inMemoryProjectRepository: InMemoryProjectRepository
let sut: CreatePeriodicReportUseCase

describe('Create new PeriodicReport', () => {
  beforeEach(() => {
    inMemoryPeriodicReportRepository = new InMemoryPeriodicReportRepository()
    inMemoryCustomerRepository = new InMemoryCustomerRepository()
    inMemoryProjectRepository = new InMemoryProjectRepository()
    sut = new CreatePeriodicReportUseCase(inMemoryPeriodicReportRepository)
  })

  it('should be able to register a new PeriodicReport', async () => {
    const customer = makeCustomer()
    await inMemoryCustomerRepository.create(customer)

    const project = makeProject({
      customerId: customer.id,
    })
    await inMemoryCustomerRepository.create(customer)
    await inMemoryProjectRepository.create(project)
    const result = await sut.execute({
      name: 'Relatório Mensal',
      month: '9',
      year: '2024',
      projectId: project.id.toString(),
      url: 'url-tste',
    })

    expect(result.isRight()).toBe(true)
  })
})
