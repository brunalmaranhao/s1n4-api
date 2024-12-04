import { z } from 'zod'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'
import { ApiTags } from '@nestjs/swagger'
import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
} from '@nestjs/common'
import { Roles } from '@/infra/auth/roles.decorator'
import { CreateCustomerAddressDto } from './dto/customer-address-dto'
import { CreateCustomerAddressUseCase } from '@/domain/project/application/use-cases/create-customer-address'

const createCustomerBodySchema = z.object({
  street: z.string(),
  number: z.string(),
  neighborhood: z.string(),
  city: z.string(),
  state: z.string(),
  country: z.string(),
  zipCode: z.string(),
  customerId: z.string(),
  complement: z.string().optional(),
})

const bodyValidationPipe = new ZodValidationPipe(createCustomerBodySchema)

@ApiTags('customer-address')
@Controller('/customer-address')
export class CreateCustomerAddressController {
  constructor(private createCustomerUseCase: CreateCustomerAddressUseCase) {}

  @Post()
  @HttpCode(201)
  @Roles([
    'INTERNAL_MANAGEMENT',
    'INTERNAL_PARTNERS',
    'INTERNAL_FINANCIAL_LEGAL',
  ])
  async handle(@Body(bodyValidationPipe) body: CreateCustomerAddressDto) {
    const {
      city,
      country,
      customerId,
      neighborhood,
      number,
      state,
      street,
      zipCode,
      complement,
    } = body

    const result = await this.createCustomerUseCase.execute({
      city,
      country,
      customerId,
      neighborhood,
      number,
      state,
      street,
      zipCode,
      complement,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        default:
          throw new BadRequestException(error.message)
      }
    }

    const { customerAddress } = result.value

    return { customerAddressId: customerAddress.id.toString() }
  }
}
