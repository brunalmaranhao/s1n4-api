import { Either, left, right } from '@/core/either'
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common'
import { PeriodicReportRepository } from '../repositories/periodic-reports-repository'
import { PeriodicReport } from '../../enterprise/entities/periodicReports'
import { UserRepository } from '../repositories/user-repository'

interface FetchPeriodicReportsByUserAndYearUseCaseRequest {
  userId: string
  year: string
}

type FetchPeriodicReportsByUserAndYearUseCaseResponse = Either<
  InternalServerErrorException,
  {
    periodicReports: PeriodicReport[]
  }
>

@Injectable()
export class FetchPeriodicReportsByUserAndYearUseCase {
  constructor(
    private periodicReportRepository: PeriodicReportRepository,
    private userRepositoy: UserRepository,
  ) {}

  async execute({
    userId,
    year,
  }: FetchPeriodicReportsByUserAndYearUseCaseRequest): Promise<FetchPeriodicReportsByUserAndYearUseCaseResponse> {
    try {
      const user = await this.userRepositoy.findById(userId)
      if (!user?.customerId) return left(new BadRequestException())

      const periodicReportsByCustomer =
        await this.periodicReportRepository.fetchByCustomerIdAndYear(
          user?.customerId.toString(),
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
