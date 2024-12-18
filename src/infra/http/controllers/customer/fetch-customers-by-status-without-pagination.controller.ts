import { z } from 'zod'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'
import { ApiTags } from '@nestjs/swagger'
import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  Param,
} from '@nestjs/common'
import { Roles } from '@/infra/auth/roles.decorator'
import { Status } from '@prisma/client'
import { CustomerPresenter } from '../../presenter/customer-presenter'
import { FetchCostumersByStatusWithoutPaginationUseCase } from '@/domain/project/application/use-cases/fetch-costumers-by-status-without-pagination'

@ApiTags('customer')
@Controller('/customer/all/:status')
export class FetchCustomersWithoutPaginationController {
  constructor(
    private fetchCostumersByStatusUseCase: FetchCostumersByStatusWithoutPaginationUseCase,
  ) {}

  @Get()
  @HttpCode(200)
  @Roles([
    'INTERNAL_MANAGEMENT',
    'INTERNAL_PARTNERS',
    'INTERNAL_FINANCIAL_LEGAL',
  ])
  async handle(@Param('status') status: string) {
    if (status !== 'active' && status !== 'inactive') {
      throw new BadRequestException('Especifique um status válido.')
    }

    const parsedStatus = status.toLocaleUpperCase() as Status
    const result = await this.fetchCostumersByStatusUseCase.execute({
      status: parsedStatus,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const customers = result.value.customers

    const response = customers.map(CustomerPresenter.toHTTPWithProjects)

    return { customers: response, total: result.value.total }
  }
}
