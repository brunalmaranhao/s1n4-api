import { makeReport } from 'test/factories/make-report'
import { CreateReportUseCase } from './create-Report'
import { InMemoryReportRepository } from 'test/repositories/in-memory-report-repository'

let inMemoryReportRepository: InMemoryReportRepository
let sut: CreateReportUseCase

describe('Create new Report', () => {
  beforeEach(() => {
    inMemoryReportRepository = new InMemoryReportRepository()
    sut = new CreateReportUseCase(inMemoryReportRepository)
  })

  it('should be able to register a new Report', async () => {
    const report = makeReport()

    const result = await sut.execute({
      customerId: report.customerId.toString(),
      name: report.name,
      pbiReportId: report.pbiReportId,
      pbiWorkspaceId: report.pbiWorkspaceId,
    })

    expect(result.isRight()).toBe(true)
  })
})
