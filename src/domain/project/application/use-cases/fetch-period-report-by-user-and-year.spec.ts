import { InMemoryCustomerRepository } from 'test/repositories/in-memory-customer-repository'
import { makeCustomer } from 'test/factories/make-customer'
import { InMemoryPeriodicReportRepository } from 'test/repositories/in-memory-periodic-report'
import { makePeriodicReport } from 'test/factories/make-periodic-report'
import { InMemoryUserRepository } from 'test/repositories/in-memory-users-repository'
import { makeUser } from 'test/factories/make-user'
import { InMemoryProjectRepository } from 'test/repositories/in-memory-project-repository'
import { makeProject } from 'test/factories/make-project'
import { FetchPeriodicReportsByUserUseCase } from './fetch-period-report-by-user'
import { FetchPeriodicReportsByUserAndYearUseCase } from './fetch-period-report-by-user-and-year'

let inMemoryUserRepository: InMemoryUserRepository
let inMemoryProjectRepository: InMemoryProjectRepository
let inMemoryCustomerRepository: InMemoryCustomerRepository
let inMemoryPeriodicReportRepository: InMemoryPeriodicReportRepository
let sut: FetchPeriodicReportsByUserAndYearUseCase

describe('Fetch Periodic Report With Users', () => {
  beforeEach(() => {
    inMemoryCustomerRepository = new InMemoryCustomerRepository()
    inMemoryUserRepository = new InMemoryUserRepository()
    inMemoryPeriodicReportRepository = new InMemoryPeriodicReportRepository()
    inMemoryProjectRepository = new InMemoryProjectRepository()
    sut = new FetchPeriodicReportsByUserAndYearUseCase(
      inMemoryPeriodicReportRepository,
      inMemoryUserRepository,
    )
  })

  it('should be able to fetch customers with their users', async () => {
    const customer1 = makeCustomer()
    const project = makeProject({
      customerId: customer1.id,
    })

    const user = makeUser({
      customerId: customer1.id,
    })
    await inMemoryProjectRepository.create(project)

    await inMemoryUserRepository.create(user)
    await inMemoryCustomerRepository.create(customer1)

    const periodicReport = makePeriodicReport({
      projectId: project.id,
      project,
      year: '2024',
    })
    await inMemoryPeriodicReportRepository.create(periodicReport)

    const result = await sut.execute({
      userId: user.id.toString(),
      year: '2024',
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.periodicReports).toHaveLength(1)
    }
  })
})
