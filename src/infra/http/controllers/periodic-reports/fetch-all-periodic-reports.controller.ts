import { ApiTags } from '@nestjs/swagger'
import { BadRequestException, Controller, Get, HttpCode } from '@nestjs/common'
import { CurrentUser } from '@/infra/auth/currrent-user.decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { PeriodicReportPresenter } from '../../presenter/periodic-report'
import { Roles } from '@/infra/auth/roles.decorator'
import { FetchAllPeriodicReportsUseCase } from '@/domain/project/application/use-cases/fetch-all-periodic-reports'

@ApiTags('periodic-report')
@Controller('/periodic-report/all')
export class FetchAllPeriodicReportsController {
  constructor(
    private fetchAllPeriodicReportsUseCase: FetchAllPeriodicReportsUseCase,
  ) {}

  @Roles([
    'INTERNAL_MANAGEMENT',
    'INTERNAL_PARTNERS',
    'INTERNAL_FINANCIAL_LEGAL',
  ])
  @Get()
  @HttpCode(200)
  async handle(@CurrentUser() user: UserPayload) {
    const result = await this.fetchAllPeriodicReportsUseCase.execute()

    if (result.isRight()) {
      const periodicReports = result.value.periodicReports
      const response = periodicReports.map(PeriodicReportPresenter.toHTTP)

      return { periodicReports: response }
    }
  }
}
