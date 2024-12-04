import { z } from 'zod'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'
import { ApiTags } from '@nestjs/swagger'
import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  Query,
} from '@nestjs/common'
import { Roles } from '@/infra/auth/roles.decorator'
import { FetchCustomersWithUsersUseCase } from '@/domain/project/application/use-cases/fetch-customers-with-users'
import { CustomersWithUsersPresenter } from '../../presenter/customers-with-users'

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
@Controller('/customer-with-users')
export class FetchCustomersWithUsersController {
  constructor(
    private fetchCustomersWithUsersUseCase: FetchCustomersWithUsersUseCase,
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
  ) {
    const result = await this.fetchCustomersWithUsersUseCase.execute({
      page,
      size,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const customerUsers = result.value.customersWithUsers

    const customersWithUsers = customerUsers.map(
      CustomersWithUsersPresenter.toHTTP,
    )

    return { customersWithUsers }
  }
}
