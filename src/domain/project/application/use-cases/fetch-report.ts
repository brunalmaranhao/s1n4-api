import { Either, left, right } from '@/core/either'
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { UserRepository } from '../repositories/user-repository'
import { ReportRepository } from '../repositories/report-repository'
import { Report } from '../../enterprise/entities/report'

interface FetchReportUseCaseRequest {
  reportId: string
  userId: string
}

type FetchReportUseCaseResponse = Either<
  UnauthorizedException | BadRequestException,
  {
    report: Report
  }
>

@Injectable()
export class FetchReportUseCase {
  constructor(
    private userRepository: UserRepository,
    private reportRepository: ReportRepository,
  ) {}

  async execute({
    reportId,
    userId,
  }: FetchReportUseCaseRequest): Promise<FetchReportUseCaseResponse> {
    const user = await this.userRepository.findById(userId)
    const report = await this.reportRepository.findById(reportId)

    if (!report) {
      return left(new BadRequestException('Relatório não encontrado.'))
    }
    if (
      user?.role.startsWith('CLIENT') &&
      report?.customerId.toString() !== user.customerId?.toString()
    ) {
      return left(
        new UnauthorizedException(
          'Usuário não tem permissão para acessar esse relatório.',
        ),
      )
    }

    return right({
      report,
    })
  }
}
