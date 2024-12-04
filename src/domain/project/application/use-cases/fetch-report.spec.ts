import { InMemoryReportRepository } from 'test/repositories/in-memory-report-repository'
import { FetchReportUseCase } from './fetch-report'
import { InMemoryUserRepository } from 'test/repositories/in-memory-users-repository'
import { makeUser } from 'test/factories/make-user'
import { makeCustomer } from 'test/factories/make-customer'
import { makeReport } from 'test/factories/make-report'

let inMemoryReportRepository: InMemoryReportRepository
let inMemoryUserRepository: InMemoryUserRepository
let sut: FetchReportUseCase

describe('Fetch report', () => {
  beforeEach(() => {
    inMemoryReportRepository = new InMemoryReportRepository()
    inMemoryUserRepository = new InMemoryUserRepository()
    sut = new FetchReportUseCase(
      inMemoryUserRepository,
      inMemoryReportRepository,
    )
  })

  it('should be able to fetch report', async () => {
    const costumer = makeCustomer()
    const user1 = makeUser({ customerId: costumer.id })
    const report = makeReport({ customerId: costumer.id })

    await inMemoryReportRepository.create(report)

    const result = await sut.execute({
      reportId: report.id.toString(),
      userId: user1.id.toString(),
    })

    expect(result.isRight()).toBe(true)
  })

  it('should not be able to fetch report.', async () => {
    const costumer = makeCustomer()
    const costumer1 = makeCustomer()
    const user1 = makeUser({ customerId: costumer.id, role: 'CLIENT_OWNER' })
    const report = makeReport({ customerId: costumer1.id })

    await inMemoryUserRepository.create(user1)
    await inMemoryReportRepository.create(report)

    const result = await sut.execute({
      reportId: report.id.toString(),
      userId: user1.id.toString(),
    })
    // console.log(result)
    expect(result.isLeft()).toBe(true)
  })
})
