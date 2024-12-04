import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  ConflictException,
  Delete,
  Param,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { Roles } from '@/infra/auth/roles.decorator'
import { RemoveCustomerUseCase } from '@/domain/project/application/use-cases/remove-customer'
import { CustomerNotFoundError } from '@/domain/project/application/use-cases/errors/customer-not-found'

@ApiTags('customer')
@Controller('/customer/:id')
export class RemoveCustomerController {
  constructor(private removeCustomerUseCase: RemoveCustomerUseCase) {}

  @Delete()
  @HttpCode(204)
  @Roles([
    'INTERNAL_MANAGEMENT',
    'INTERNAL_PARTNERS',
    'INTERNAL_FINANCIAL_LEGAL',
  ])
  async handle(@Param('id') id: string) {
    const result = await this.removeCustomerUseCase.execute({
      id,
    })

    if (result.isLeft()) {
      const error = result.value
      switch (error.constructor) {
        case CustomerNotFoundError:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
