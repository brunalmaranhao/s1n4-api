import { Either, left, right } from '@/core/either'
import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { PeriodicReport } from '../../enterprise/entities/periodicReports'
import { PeriodicReportRepository } from '../repositories/periodic-reports-repository'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

interface CreatePeriodicReportUseCaseRequest {
  name: string
  year: string
  month: string
  url: string
  projectId: string
}

type CreatePeriodicReportUseCaseResponse = Either<
  InternalServerErrorException,
  {
    report: PeriodicReport
  }
>

@Injectable()
export class CreatePeriodicReportUseCase {
  constructor(private periodicReportRepository: PeriodicReportRepository) {}

  async execute({
    name,
    year,
    month,
    url,
    projectId,
  }: CreatePeriodicReportUseCaseRequest): Promise<CreatePeriodicReportUseCaseResponse> {
    try {
      const existingReports =
        await this.periodicReportRepository.findByMonthAndYearProjectId(
          month,
          year,
          projectId,
        )

      const reportForCustomer = existingReports.find(
        (existingReport) => existingReport.status === 'ACTIVE',
      )

      if (reportForCustomer) {
        await this.periodicReportRepository.remove(
          reportForCustomer.id.toString(),
        )
      }

      const newPeriodicReport = PeriodicReport.create({
        projectId: new UniqueEntityID(projectId),
        name,
        url,
        year,
        month,
      })

      const createdReport =
        await this.periodicReportRepository.create(newPeriodicReport)

      return right({
        report: createdReport,
      })
    } catch (error) {
      return left(new InternalServerErrorException())
    }
  }
}
