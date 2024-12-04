import { InMemoryReportRepository } from 'test/repositories/in-memory-report-repository'
import { InMemoryUserRepository } from 'test/repositories/in-memory-users-repository'
import { makeUser } from 'test/factories/make-user'
import { makeCustomer } from 'test/factories/make-customer'
import { makeReport } from 'test/factories/make-report'
import { InMemoryCustomerRepository } from 'test/repositories/in-memory-customer-repository'
import { FetchAllReportsUseCase } from './fetch-all-reports'

let inMemoryReportRepository: InMemoryReportRepository
let inMemoryUserRepository: InMemoryUserRepository
let inMemoryCustomerRepository: InMemoryCustomerRepository
let sut: FetchAllReportsUseCase

describe('Fetch all reports', () => {
  beforeEach(() => {
    inMemoryReportRepository = new InMemoryReportRepository()
    inMemoryUserRepository = new InMemoryUserRepository()
    inMemoryCustomerRepository = new InMemoryCustomerRepository()
    sut = new FetchAllReportsUseCase(inMemoryReportRepository)
  })

  it('should be able to fetch reports', async () => {
    const costumer = makeCustomer()
    const user1 = makeUser({ customerId: costumer.id })
    const report = makeReport({ customerId: costumer.id })
    await inMemoryUserRepository.create(user1)
    await inMemoryCustomerRepository.create(costumer)
    await inMemoryReportRepository.create(report)

    const result = await sut.execute({
      page: 1,
      size: 5,
    })

    expect(result.isRight()).toBe(true)
  })
})
