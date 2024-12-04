import { ApiTags } from '@nestjs/swagger'
import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  Param,
} from '@nestjs/common'
import { Roles } from '@/infra/auth/roles.decorator'
import { FetchCustomerUseCase } from '@/domain/project/application/use-cases/fetch-customer-by-id'
import { CustomerNotFoundError } from '@/domain/project/application/use-cases/errors/customer-not-found'
import { CustomerPresenterAllFields } from '../../presenter/customer-presenter-all-fields'

@ApiTags('customer')
@Controller('/customer/id/:id')
export class FetchCustomerController {
  constructor(private fetchCostumerUseCase: FetchCustomerUseCase) {}

  @Get()
  @HttpCode(200)
  @Roles([
    'INTERNAL_MANAGEMENT',
    'INTERNAL_PARTNERS',
    'INTERNAL_FINANCIAL_LEGAL',
    'CLIENT_USER',
    'CLIENT_RESPONSIBLE',
    'CLIENT_OWNER',
  ])
  async handle(@Param('id') id: string) {
    const result = await this.fetchCostumerUseCase.execute({
      id,
    })

    if (result.isLeft()) {
      const error = result.value
      switch (error.constructor) {
        case CustomerNotFoundError:
          throw new BadRequestException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    const response = CustomerPresenterAllFields.toHTTP(result.value.customer)

    return { customer: response }
  }
}
