import { Either, left, right } from '@/core/either'
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { ReportRepository } from '../repositories/report-repository'
import { Report } from '../../enterprise/entities/report'

interface FecthAllReportsUseCaseRequest {
  page: number
  size: number
}

type FecthAllReportsUseCaseResponse = Either<
  UnauthorizedException | BadRequestException,
  {
    reports: Report[]
    total: number
  }
>

@Injectable()
export class FetchAllReportsUseCase {
  constructor(private reportRepository: ReportRepository) {}

  async execute({
    page,
    size,
  }: FecthAllReportsUseCaseRequest): Promise<FecthAllReportsUseCaseResponse> {
    const response = await this.reportRepository.findAll({
      page,
      size,
    })

    return right({
      reports: response.reports,
      total: response.total,
    })
  }
}
