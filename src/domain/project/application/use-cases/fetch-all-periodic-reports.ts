import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { PeriodicReportRepository } from '../repositories/periodic-reports-repository'
import { PeriodicReport } from '../../enterprise/entities/periodicReports'

type FetchAllPeriodicReportsUseCaseResponse = Either<
  null,
  {
    periodicReports: PeriodicReport[]
  }
>

@Injectable()
export class FetchAllPeriodicReportsUseCase {
  constructor(private periodicReportRepository: PeriodicReportRepository) {}

  async execute(): Promise<FetchAllPeriodicReportsUseCaseResponse> {
    const periodicReports =
      await this.periodicReportRepository.findAllWithoutPagination()

    return right({
      periodicReports,
    })
  }
}
