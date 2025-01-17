import { Either, left, right } from '@/core/either'
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common'
import { PeriodicReportRepository } from '../repositories/periodic-reports-repository'
import { PeriodicReport } from '../../enterprise/entities/periodicReports'
import { UserRepository } from '../repositories/user-repository'

interface FetchPeriodicReportsByCustomerUseCaseRequest {
  customerId: string
}

type FetchPeriodicReportsByCustomerUseCaseResponse = Either<
  InternalServerErrorException,
  {
    periodicReports: PeriodicReport[]
  }
>

@Injectable()
export class FetchPeriodicReportsByCustomerUseCase {
  constructor(
    private periodicReportRepository: PeriodicReportRepository,
    private userRepositoy: UserRepository,
  ) {}

  async execute({
    customerId,
  }: FetchPeriodicReportsByCustomerUseCaseRequest): Promise<FetchPeriodicReportsByCustomerUseCaseResponse> {
    try {
      const periodicReportsByCustomer =
        await this.periodicReportRepository.fetchByCustomerId(customerId)
      return right({
        periodicReports: periodicReportsByCustomer.reports,
      })
    } catch (error) {
      return left(new InternalServerErrorException())
    }
  }
}
