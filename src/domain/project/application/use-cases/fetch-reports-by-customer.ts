import { Either, left, right } from '@/core/either'
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { ReportRepository } from '../repositories/report-repository'
import { Report } from '../../enterprise/entities/report'
import { CustomerRepository } from '../repositories/customer-repository'
import { CustomerNotFoundError } from './errors/customer-not-found'
import { RequesterNotFromCustomer } from './errors/requester-not-from-customer'
import { UserRepository } from '../repositories/user-repository'

interface FetchReportsByCustomerUseCaseRequest {
  userId: string
  page: number
  size: number
  customerId: string
}

type FetchReportsByCustomerUseCaseResponse = Either<
  CustomerNotFoundError | RequesterNotFromCustomer,
  {
    reports: Report[]
    total: number
  }
>

@Injectable()
export class FetchReportsByCustomerUseCase {
  constructor(
    private usersRepository: UserRepository,
    private reportRepository: ReportRepository,
    private customerRepository: CustomerRepository,
  ) {}

  async execute({
    page,
    size,
    customerId,
    userId,
  }: FetchReportsByCustomerUseCaseRequest): Promise<FetchReportsByCustomerUseCaseResponse> {
    const user = await this.usersRepository.findById(userId)

    const customer = await this.customerRepository.findById(customerId)

    if (!customer) {
      return left(new CustomerNotFoundError())
    }

    if (!user || user.customerId?.toString() !== customerId) {
      return left(new RequesterNotFromCustomer())
    }

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
