import { Either, left, right } from '@/core/either'
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common'
import { PeriodicReportRepository } from '../repositories/periodic-reports-repository'
import { PeriodicReport } from '../../enterprise/entities/periodicReports'
import { UserRepository } from '../repositories/user-repository'

interface FetchPeriodicReportsByUserUseCaseRequest {
  userId: string
}

type FetchPeriodicReportsByUserUseCaseResponse = Either<
  InternalServerErrorException,
  {
    periodicReports: PeriodicReport[]
  }
>

@Injectable()
export class FetchPeriodicReportsByUserUseCase {
  constructor(
    private periodicReportRepository: PeriodicReportRepository,
    private userRepositoy: UserRepository,
  ) {}

  async execute({
    userId,
  }: FetchPeriodicReportsByUserUseCaseRequest): Promise<FetchPeriodicReportsByUserUseCaseResponse> {
    try {
      const user = await this.userRepositoy.findById(userId)
      if (!user?.customerId) return left(new BadRequestException())

      const periodicReportsByCustomer =
        await this.periodicReportRepository.fetchByCustomerId(
          user?.customerId.toString(),
        )
      return right({
        periodicReports: periodicReportsByCustomer.reports,
      })
    } catch (error) {
      return left(new InternalServerErrorException())
    }
  }
}
