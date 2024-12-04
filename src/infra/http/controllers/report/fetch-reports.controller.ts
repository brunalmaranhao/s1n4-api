import { ApiTags } from '@nestjs/swagger'
import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  Query,
  UnauthorizedException,
} from '@nestjs/common'
import { CurrentUser } from '@/infra/auth/currrent-user.decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { FetchReportsUseCase } from '@/domain/project/application/use-cases/fetch-reports-customer'
import { ReportPresenter } from '../../presenter/reports-presenter'
import { z } from 'zod'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'

const pageQueryParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))

const sizeQueryParamSchema = z
  .string()
  .optional()
  .default('10')
  .transform(Number)
  .pipe(z.number().min(10))

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>

const querySizeValidationPipe = new ZodValidationPipe(sizeQueryParamSchema)

type SizeQueryParamSchema = z.infer<typeof sizeQueryParamSchema>

@ApiTags('report')
@Controller('/reports')
export class FetchReportsController {
  constructor(private fetchReportsUseCase: FetchReportsUseCase) {}

  @Get()
  @HttpCode(200)
  async handle(
    @CurrentUser() user: UserPayload,
    @Query('page', queryValidationPipe) page: PageQueryParamSchema,
    @Query('size', querySizeValidationPipe) size: SizeQueryParamSchema,
  ) {
    const result = await this.fetchReportsUseCase.execute({
      page,
      size,
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

    const reports = result.value.reports
    const presenter = reports.map(ReportPresenter.toHTTP)

    return { reports: presenter }
  }
}
