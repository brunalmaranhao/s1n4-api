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
import { FetchReportUseCase } from '@/domain/project/application/use-cases/fetch-report'
import { PbiEmbedService } from '@/infra/pbi/embed'
import { PbiCapacityManagementService } from '@/infra/pbi/capacity-management'
import { SuspendCapacitySchedulerService } from '@/infra/schedule/report/suspend-capacity'
import { CreateLogProducer } from '@/infra/jobs/log/create-log-producer'

@ApiTags('report')
@Controller('/pbi-report/:id')
export class FetchReportPbiController {
  constructor(
    private fetchReportUseCase: FetchReportUseCase,
    private pbiEmbedService: PbiEmbedService,
    private pbiCapacityManagementService: PbiCapacityManagementService,
    private suspendCapacitySchedulerService: SuspendCapacitySchedulerService,
    private createLogProducer: CreateLogProducer,
  ) {}

  @Get()
  @HttpCode(200)
  async handle(@CurrentUser() user: UserPayload, @Param('id') id: string) {
    const result = await this.fetchReportUseCase.execute({
      reportId: id,
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

    await this.pbiCapacityManagementService.resume()
    await this.suspendCapacitySchedulerService.suspendCapacityScheduler()

    const report = result.value.report

    const embedInfo = await this.pbiEmbedService.getEmbedInfo(
      report.pbiWorkspaceId,
      report.pbiReportId,
    )
    await this.createLogProducer.createLogReport(report.id.toString(), user.sub)

    return { embedInfo }
  }
}
