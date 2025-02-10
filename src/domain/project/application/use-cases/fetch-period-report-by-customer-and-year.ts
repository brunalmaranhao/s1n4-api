import { Either, left, right } from '@/core/either'
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common'
import { PeriodicReportRepository } from '../repositories/periodic-reports-repository'
import { PeriodicReport } from '../../enterprise/entities/periodicReports'
import { UserRepository } from '../repositories/user-repository'

interface FetchPeriodicReportsByCustomerAndYearUseCaseRequest {
  customerId: string
  year: string
}

type FetchPeriodicReportsByCustomerAndYearUseCaseResponse = Either<
  InternalServerErrorException,
  {
    periodicReports: PeriodicReport[]
  }
>

@Injectable()
export class FetchPeriodicReportsByCustomerAndYearUseCase {
  constructor(
    private periodicReportRepository: PeriodicReportRepository,
    private userRepositoy: UserRepository,
  ) {}

  async execute({
    customerId,
    year,
  }: FetchPeriodicReportsByCustomerAndYearUseCaseRequest): Promise<FetchPeriodicReportsByCustomerAndYearUseCaseResponse> {
    try {
      const periodicReportsByCustomer =
        await this.periodicReportRepository.fetchByCustomerIdAndYear(
          customerId,
          year,
        )
      return right({
        periodicReports: periodicReportsByCustomer.reports,
      })
    } catch (error) {
      return left(new InternalServerErrorException())
    }
  }
}
