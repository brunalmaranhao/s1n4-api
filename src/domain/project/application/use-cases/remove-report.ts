import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { ReportRepository } from '../repositories/report-repository'
import { ReportNotFoundError } from './errors/report-not-found-error'
import { ReportAlreadyInativeError } from './errors/report-already-inative-error'

interface RemoveReportUseCaseRequest {
  id: string
}

type RemoveReportUseCaseResponse = Either<
  ReportNotFoundError | ReportAlreadyInativeError,
  null
>

@Injectable()
export class RemoveReportUseCase {
  constructor(private reportRepository: ReportRepository) {}

  async execute({
    id,
  }: RemoveReportUseCaseRequest): Promise<RemoveReportUseCaseResponse> {
    const report = await this.reportRepository.findById(id)

    if (!report) {
      return left(new ReportNotFoundError(id))
    }

    if (report.status === 'INACTIVE') {
      return left(new ReportAlreadyInativeError())
    }

    await this.reportRepository.updateStatus(id, 'INACTIVE')

    return right(null)
  }
}
