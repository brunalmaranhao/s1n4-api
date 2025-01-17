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
import { Roles } from '@/infra/auth/roles.decorator'
import { FetchPeriodicReportsByCustomerUseCase } from '@/domain/project/application/use-cases/fetch-period-report-by-customer'

@ApiTags('periodic-report')
@Controller('/periodic-report/customer/:customerId')
export class FetchPeriodicReportsByCustomerController {
  constructor(
    private fetchPeriodicReportsByCustomerUseCase: FetchPeriodicReportsByCustomerUseCase,
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
    @Param('year') customerId: string,
  ) {
    const result = await this.fetchPeriodicReportsByCustomerUseCase.execute({
      customerId,
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
