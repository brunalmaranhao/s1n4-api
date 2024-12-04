import { ApiTags } from '@nestjs/swagger'
import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  Param,
  Query,
  UnauthorizedException,
} from '@nestjs/common'
import { FetchReportsUseCase } from '@/domain/project/application/use-cases/fetch-reports-customer'
import { ReportPresenter } from '../../presenter/reports-presenter'
import { z } from 'zod'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'
import { CurrentUser } from '@/infra/auth/currrent-user.decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { FetchReportsByCustomerUseCase } from '@/domain/project/application/use-cases/fetch-reports-by-customer'

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
@Controller('/reports/:customerId')
export class FetchReportsByCustomerController {
  constructor(
    private fetchReportsByCustomerUseCase: FetchReportsByCustomerUseCase,
  ) {}

  @Get()
  @HttpCode(200)
  async handle(
    @CurrentUser() user: UserPayload,
    @Query('page', queryValidationPipe) page: PageQueryParamSchema,
    @Query('size', querySizeValidationPipe) size: SizeQueryParamSchema,
    @Param('customerId') customerId: string,
  ) {
    const result = await this.fetchReportsByCustomerUseCase.execute({
      page,
      size,
      userId: user.sub,
      customerId,
    })

    if (result.isLeft()) {
      const error = result.value
      throw new BadRequestException(error.message)
    }

    const reports = result.value.reports

    const presenter = reports.map(ReportPresenter.toHTTP)

    return { reports: presenter }
  }
}
