import { ApiTags } from '@nestjs/swagger'
import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  Param,
  UnauthorizedException,
} from '@nestjs/common'
import { CurrentUser } from '@/infra/auth/currrent-user.decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { PeriodicReportPresenter } from '../../presenter/periodic-report'
import { FetchPeriodicReportsByCustomerAndYearUseCase } from '@/domain/project/application/use-cases/fetch-period-report-by-customer-and-year'
import { Roles } from '@/infra/auth/roles.decorator'

@ApiTags('periodic-report')
@Controller('/periodic-report/customer/:customerId/:year')
export class FetchPeriodicReportsByCustomerAndYearController {
  constructor(
    private fetchPeriodicReportsByCustomerAndYearUseCase: FetchPeriodicReportsByCustomerAndYearUseCase,
  ) {}

  @Roles([
    'INTERNAL_MANAGEMENT',
    'INTERNAL_PARTNERS',
    'INTERNAL_FINANCIAL_LEGAL',
  ])
  @Get()
  @HttpCode(200)
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('year') year: string,
    @Param('customerId') customerId: string,
  ) {
    const result =
      await this.fetchPeriodicReportsByCustomerAndYearUseCase.execute({
        customerId,
        year,
      })

    if (result.isLeft()) {
      const error = result.value
      switch (error.constructor) {
        case UnauthorizedException:
          throw new UnauthorizedException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    const periodicReports = result.value.periodicReports
    const response = periodicReports.map(PeriodicReportPresenter.toHTTP)

    return { periodicReports: response }
  }
}
