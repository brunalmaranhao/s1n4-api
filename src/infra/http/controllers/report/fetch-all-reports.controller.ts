import { ApiTags } from '@nestjs/swagger'
import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  Query,
  UnauthorizedException,
} from '@nestjs/common'
import { PbiEmbedService, ReportDetailsResponse } from '@/infra/pbi/embed'
import { PbiCapacityManagementService } from '@/infra/pbi/capacity-management'
import { SuspendCapacitySchedulerService } from '@/infra/schedule/report/suspend-capacity'
import { Roles } from '@/infra/auth/roles.decorator'
import { FetchAllReportsUseCase } from '@/domain/project/application/use-cases/fetch-all-reports'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'
import { z } from 'zod'
import { CreateLogProducer } from '@/infra/jobs/log/create-log-producer'
import { CurrentUser } from '@/infra/auth/currrent-user.decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'

const pageQueryParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))

const sizeQueryParamSchema = z
  .string()
  .optional()
  .default('4')
  .transform(Number)
  .pipe(z.number().min(4))

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>

const querySizeValidationPipe = new ZodValidationPipe(sizeQueryParamSchema)

type SizeQueryParamSchema = z.infer<typeof sizeQueryParamSchema>

@ApiTags('report')
@Controller('/pbi-reports/all')
export class FetchAllReportsPbiController {
  constructor(
    private fetchReportsUseCase: FetchAllReportsUseCase,
    private pbiEmbedService: PbiEmbedService,
    private pbiCapacityManagementService: PbiCapacityManagementService,
    private suspendCapacitySchedulerService: SuspendCapacitySchedulerService,
    private createLogProducer: CreateLogProducer,
  ) {}

  @Get()
  @HttpCode(200)
  @Roles([
    'INTERNAL_MANAGEMENT',
    'INTERNAL_PARTNERS',
    'INTERNAL_FINANCIAL_LEGAL',
  ])
  async handle(
    @Query('page', queryValidationPipe) page: PageQueryParamSchema,
    @Query('size', querySizeValidationPipe) size: SizeQueryParamSchema,
    @CurrentUser() user: UserPayload,
  ) {
    const result = await this.fetchReportsUseCase.execute({
      page,
      size,
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

    const reports = result.value.reports
    const reportsEmbeds: ReportDetailsResponse[] = []

    await this.pbiCapacityManagementService.resume()

    for (const report of reports) {
      const embedInfo = await this.pbiEmbedService.getEmbedInfo(
        report.pbiWorkspaceId,
        report.pbiReportId,
      )
      if (embedInfo) {
        reportsEmbeds.push({
          ...embedInfo,
          name: report.name,
          id: report.id.toString(),
          isError: false,
        })
      } else {
        reportsEmbeds.push({
          isError: true,
          name: report.name,
          id: report.id.toString(),
        })
      }
    }

    const capacityResumed = await this.waitForCapacityToResume(
      this.pbiCapacityManagementService,
    )

    if (!capacityResumed) {
      throw new BadRequestException(
        'A capacidade não pôde ser ligada. Tente novamente mais tarde.',
      )
    }

    await this.suspendCapacitySchedulerService.suspendCapacityScheduler()
    await this.createLogProducer.createLogReports(reports, user.sub)

    return { reportsEmbeds, total: result.value.total }
  }

  async waitForCapacityToResume(
    pbiCapacityManagementService: PbiCapacityManagementService,
    maxRetries = 20,
    delay = 3000, // 3 segundos
  ): Promise<boolean> {
    let retries = 0

    while (retries < maxRetries) {
      const response = await pbiCapacityManagementService.getCapacityState()
      const responseObject = await response?.json()

      if (responseObject.value[0].properties.state === 'Succeeded') {
        return true
      }

      retries++

      await new Promise((resolve) => setTimeout(resolve, delay))
    }

    return false
  }
}
