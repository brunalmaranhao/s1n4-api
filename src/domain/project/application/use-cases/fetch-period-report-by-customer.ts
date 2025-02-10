import { Either, left, right } from '@/core/either'
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common'
import { PeriodicReportRepository } from '../repositories/periodic-reports-repository'
import { PeriodicReport } from '../../enterprise/entities/periodicReports'
import { UserRepository } from '../repositories/user-repository'

interface FetchPeriodicReportsByCustomerUseCaseRequest {
  customerId: string
  userId?: string
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
    userId,
  }: FetchPeriodicReportsByCustomerUseCaseRequest): Promise<FetchPeriodicReportsByCustomerUseCaseResponse> {
    try {
      if (userId) {
        const user = await this.userRepositoy.findById(userId)
        if (
          (user?.role === 'CLIENT_OWNER' ||
            user?.role === 'CLIENT_RESPONSIBLE' ||
            user?.role === 'CLIENT_USER') &&
          user?.customerId?.toString() !== customerId
        ) {
          return left(new ForbiddenException())
        }
      }

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
