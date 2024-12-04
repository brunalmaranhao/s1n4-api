import { Either, left, right } from '@/core/either'
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { UserRepository } from '../repositories/user-repository'
import { ReportRepository } from '../repositories/report-repository'
import { Report } from '../../enterprise/entities/report'

interface FetchReportsUseCaseRequest {
  userId?: string
  page: number
  size: number
  customerId?: string
}

type FetchReportsUseCaseResponse = Either<
  UnauthorizedException | BadRequestException,
  {
    reports: Report[]
    total: number
  }
>

@Injectable()
export class FetchReportsUseCase {
  constructor(
    private userRepository: UserRepository,
    private reportRepository: ReportRepository,
  ) {}

  async execute({
    userId,
    page,
    size,
    customerId,
  }: FetchReportsUseCaseRequest): Promise<FetchReportsUseCaseResponse> {
    if (userId) {
      const user = await this.userRepository.findById(userId)

      if (!user?.customerId) {
        return left(
          new BadRequestException('Usuário não pertence a cliente algum.'),
        )
      }
      return this.fetchReportsByCustomerId(
        user.customerId.toString(),
        page,
        size,
      )
    }

    if (customerId) {
      return this.fetchReportsByCustomerId(customerId, page, size)
    }

    return left(
      new BadRequestException('Nem usuário nem cliente foram fornecidos.'),
    )
  }

  private async fetchReportsByCustomerId(
    customerId: string,
    page: number,
    size: number,
  ): Promise<FetchReportsUseCaseResponse> {
    const response = await this.reportRepository.findByCustomerId(
      { page, size },
      customerId,
    )

    return right({
      reports: response.reports,
      total: response.total,
    })
  }
}
