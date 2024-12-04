import { z } from 'zod'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'
import { ApiTags } from '@nestjs/swagger'
import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Query,
} from '@nestjs/common'
import { Roles } from '@/infra/auth/roles.decorator'
import { FetchCustomerUsersUseCase } from '@/domain/project/application/use-cases/fetch-customer-users'
import { CustomerNotFoundError } from '@/domain/project/application/use-cases/errors/customer-not-found'
import { CustomerUsersPresenter } from '../../presenter/customer-user-presenter'

const pageQueryParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>

@ApiTags('customer')
@Controller('/customer/:customerId/users')
export class FetchCustomerUsersController {
  constructor(private fetchCustomerUsersUseCase: FetchCustomerUsersUseCase) {}

  @Get()
  @HttpCode(200)
  @Roles([
    'INTERNAL_MANAGEMENT',
    'INTERNAL_PARTNERS',
    'INTERNAL_FINANCIAL_LEGAL',
  ])
  async handle(
    @Query('page', queryValidationPipe) page: PageQueryParamSchema,
    @Param('customerId') customerId: string,
  ) {
    const result = await this.fetchCustomerUsersUseCase.execute({
      page,
      customerId,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case CustomerNotFoundError:
          throw new NotFoundException()
        default:
          throw new BadRequestException()
      }
    }

    const customerUsers = result.value.users

    const users = customerUsers.map(CustomerUsersPresenter.toHTTP)

    return { users }
  }
}
