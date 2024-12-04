import { InMemoryReportRepository } from 'test/repositories/in-memory-report-repository'
import { InMemoryUserRepository } from 'test/repositories/in-memory-users-repository'
import { makeUser } from 'test/factories/make-user'
import { makeCustomer } from 'test/factories/make-customer'
import { makeReport } from 'test/factories/make-report'
import { FetchReportsUseCase } from './fetch-reports-customer'
import { InMemoryCustomerRepository } from 'test/repositories/in-memory-customer-repository'

let inMemoryReportRepository: InMemoryReportRepository
let inMemoryUserRepository: InMemoryUserRepository
let inMemoryCustomerRepository: InMemoryCustomerRepository
let sut: FetchReportsUseCase

describe('Fetch reports', () => {
  beforeEach(() => {
    inMemoryReportRepository = new InMemoryReportRepository()
    inMemoryUserRepository = new InMemoryUserRepository()
    inMemoryCustomerRepository = new InMemoryCustomerRepository()
    sut = new FetchReportsUseCase(
      inMemoryUserRepository,
      inMemoryReportRepository,
    )
  })

  it('should be able to fetch reports', async () => {
    const costumer = makeCustomer()
    const user1 = makeUser({ customerId: costumer.id })
    const report = makeReport({ customerId: costumer.id })
    await inMemoryUserRepository.create(user1)
    await inMemoryCustomerRepository.create(costumer)
    await inMemoryReportRepository.create(report)

    const result = await sut.execute({
      userId: user1.id.toString(),
    })

    expect(result.isRight()).toBe(true)
  })

  it('should not be able to fetch report.', async () => {
    const costumer1 = makeCustomer()
    const user1 = makeUser({ role: 'INTERNAL_FINANCIAL_LEGAL' })
    const report = makeReport({ customerId: costumer1.id })

    await inMemoryUserRepository.create(user1)
    await inMemoryReportRepository.create(report)

    const result = await sut.execute({
      userId: user1.id.toString(),
    })
    // console.log(result)
    expect(result.isLeft()).toBe(true)
  })
})
