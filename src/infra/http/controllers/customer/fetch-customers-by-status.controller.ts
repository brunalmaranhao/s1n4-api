import { z } from 'zod'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'
import { ApiTags } from '@nestjs/swagger'
import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  Param,
  Query,
} from '@nestjs/common'
import { Roles } from '@/infra/auth/roles.decorator'
import { FetchCostumersByStatusUseCase } from '@/domain/project/application/use-cases/fetch-costumers-by-status'
import { Status } from '@prisma/client'
import { CustomerPresenter } from '../../presenter/customer-presenter'

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
  .pipe(z.number().min(5))

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>

const querySizeValidationPipe = new ZodValidationPipe(sizeQueryParamSchema)

type SizeQueryParamSchema = z.infer<typeof sizeQueryParamSchema>

@ApiTags('customer')
@Controller('/customer/:status')
export class FetchCustomersController {
  constructor(
    private fetchCostumersByStatusUseCase: FetchCostumersByStatusUseCase,
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
    @Param('status') status: string,
  ) {
    if (status !== 'active' && status !== 'inactive') {
      throw new BadRequestException('Especifique um status válido.')
    }

    const parsedStatus = status.toLocaleUpperCase() as Status
    const result = await this.fetchCostumersByStatusUseCase.execute({
      page,
      status: parsedStatus,
      size,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const customers = result.value.customers

    const response = customers.map(CustomerPresenter.toHTTPWithAllFields)

    return { customers: response, total: result.value.total }
  }
}
