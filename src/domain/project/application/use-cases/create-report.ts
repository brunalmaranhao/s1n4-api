import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ReportRepository } from '../repositories/report-repository'
import { ReportAlreadyExistsError } from './errors/report-already-exists-error'
import { Report } from '../../enterprise/entities/report'

interface CreateReportUseCaseRequest {
  name: string
  customerId: string
  pbiWorkspaceId: string
  pbiReportId: string
}

type CreateReportUseCaseResponse = Either<
  ReportAlreadyExistsError,
  {
    report: Report
  }
>

@Injectable()
export class CreateReportUseCase {
  constructor(private reportRepository: ReportRepository) {}

  async execute({
    name,
    customerId,
    pbiWorkspaceId,
    pbiReportId,
  }: CreateReportUseCaseRequest): Promise<CreateReportUseCaseResponse> {
    const reportAlreadyExists =
      await this.reportRepository.findByWorkspaceIdAndReportId(
        pbiWorkspaceId,
        pbiReportId,
      )

    if (reportAlreadyExists && reportAlreadyExists.status === 'ACTIVE') {
      return left(new ReportAlreadyExistsError())
    } else if (
      reportAlreadyExists &&
      reportAlreadyExists.status === 'INACTIVE'
    ) {
      await this.reportRepository.updateStatus(
        reportAlreadyExists.id.toString(),
        'ACTIVE',
      )
      return right({ report: reportAlreadyExists })
    }

    const newReport = Report.create({
      name,
      customerId: new UniqueEntityID(customerId),
      pbiReportId,
      pbiWorkspaceId,
      status: 'ACTIVE',
    })

    const report = await this.reportRepository.create(newReport)

    return right({
      report,
    })
  }
}
