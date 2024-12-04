import { InMemoryHistoryLogRepository } from 'test/repositories/in-memory-history-log-repository'
import { makeHistoryLog } from 'test/factories/make-history-log'
import { CreateHistoryLogReportUseCase } from './create-history-log-report'
import { InMemoryReportRepository } from 'test/repositories/in-memory-report-repository'
import { makeReport } from 'test/factories/make-report'

let inMemoryHistoryLogRepository: InMemoryHistoryLogRepository
let inMemoryReportRepository: InMemoryReportRepository
let sut: CreateHistoryLogReportUseCase

describe('Create new HistoryLog Report', () => {
  beforeEach(() => {
    inMemoryHistoryLogRepository = new InMemoryHistoryLogRepository()
    inMemoryReportRepository = new InMemoryReportRepository()
    sut = new CreateHistoryLogReportUseCase(
      inMemoryHistoryLogRepository,
      inMemoryReportRepository,
    )
  })

  it('should be able to register a new HistoryLog', async () => {
    const report = makeReport()
    const historyLog = makeHistoryLog({
      reportId: report.id,
    })

    await inMemoryReportRepository.create(report)

    const result = await sut.execute({
      reportId: report.id.toString(),
      userId: historyLog.userId.toString(),
    })

    expect(result.isRight()).toBe(true)
  })
})
