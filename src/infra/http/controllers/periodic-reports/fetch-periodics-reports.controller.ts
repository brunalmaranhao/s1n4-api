import { ApiTags } from '@nestjs/swagger'
import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  UnauthorizedException,
} from '@nestjs/common'
import { CurrentUser } from '@/infra/auth/currrent-user.decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { PeriodicReportPresenter } from '../../presenter/periodic-report'
import { FetchPeriodicReportsByUserUseCase } from '@/domain/project/application/use-cases/fetch-period-report-by-user'

@ApiTags('periodic-report')
@Controller('/periodic-report')
export class FetchPeriodicReportsByUserController {
  constructor(
    private fetchPeriodicReportsByUserUseCase: FetchPeriodicReportsByUserUseCase,
  ) {}

  @Get()
  @HttpCode(200)
  async handle(@CurrentUser() user: UserPayload) {
    const result = await this.fetchPeriodicReportsByUserUseCase.execute({
      userId: user.sub,
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
