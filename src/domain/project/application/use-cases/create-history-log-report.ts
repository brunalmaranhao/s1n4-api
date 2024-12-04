import { Either, left, right } from '@/core/either'
import { BadRequestException, Injectable } from '@nestjs/common'
import { HistoryLogRepository } from '../repositories/history-repository'
import { HistoryLog } from '../../enterprise/entities/historyLog'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ReportRepository } from '../repositories/report-repository'

interface CreateHistoryLogReportUseCaseRequest {
  userId: string
  reportId: string
}

type CreateHistoryLogReportUseCaseResponse = Either<
  BadRequestException,
  {
    historyLog: HistoryLog
  }
>

@Injectable()
export class CreateHistoryLogReportUseCase {
  constructor(
    private historyLogRepository: HistoryLogRepository,
    private reportRepository: ReportRepository,
  ) {}

  async execute({
    userId,
    reportId,
  }: CreateHistoryLogReportUseCaseRequest): Promise<CreateHistoryLogReportUseCaseResponse> {
    console.log(reportId)
    const report = await this.reportRepository.findById(reportId)

    if (!report) {
      return left(new BadRequestException('Relatório não encontrado.'))
    }

    const newHistoryLog = HistoryLog.create({
      userId: new UniqueEntityID(userId),
      reportId: new UniqueEntityID(reportId),
      action: 'ACCESS_REPORT',
    })

    const historyLog = await this.historyLogRepository.create(newHistoryLog)

    return right({
      historyLog,
    })
  }
}
