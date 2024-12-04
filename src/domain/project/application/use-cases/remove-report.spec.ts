import { InMemoryReportRepository } from 'test/repositories/in-memory-Report-repository'
import { RemoveReportUseCase } from './remove-report'
import { makeReport } from 'test/factories/make-report'

let inMemoryReportRepository: InMemoryReportRepository
let sut: RemoveReportUseCase

describe('Remove report', () => {
  beforeEach(() => {
    inMemoryReportRepository = new InMemoryReportRepository()

    sut = new RemoveReportUseCase(inMemoryReportRepository)
  })

  it('should change status to inactive when removing an active Report', async () => {
    const report = makeReport()

    inMemoryReportRepository.create(report)

    const result = await sut.execute({
      id: report.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toBeNull()
    expect(inMemoryReportRepository.items[0].status).toBe('INACTIVE')
  })
})
