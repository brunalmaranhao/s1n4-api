import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Param,
  Put,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { ApiTags } from '@nestjs/swagger'
import { Roles } from '@/infra/auth/roles.decorator'
import { UpdateCustomerUseCase } from '@/domain/project/application/use-cases/update-customer'
import { UpdateCustomerDto } from './dto/update-customer-dto'
import { CustomerEditProps } from '@/core/types/customer-props'
import { CustomerNotFoundError } from '@/domain/project/application/use-cases/errors/customer-not-found'

const PaymentMethodSchema = z.enum(['CREDIT_CARD, PIX'])

const updateCustomerSchema = z
  .object({
    contractDuration: z.string().optional(),
    contractValue: z.number().optional(),
    paymentMethods: PaymentMethodSchema.optional(),
    accumulatedInvestment: z.number().optional(),
    expenditureProjection: z.number().optional(),
    contractObjective: z.string().optional(),
    contractedServices: z.string().optional(),
  })
  .refine(
    (data) => {
      const keys = Object.keys(data)
      return keys.some((key) => data[key] !== undefined)
    },
    {
      message: 'Pelo menos um dos atributos deve estar presente.',
    },
  )

const bodyValidationPipe = new ZodValidationPipe(updateCustomerSchema)

@ApiTags('customer')
@Controller('/customer/update/:id')
export class UpdateCustomerController {
  constructor(private updateCustomerUseCase: UpdateCustomerUseCase) {}

  @Put()
  @HttpCode(201)
  @Roles([
    'INTERNAL_MANAGEMENT',
    'INTERNAL_PARTNERS',
    'INTERNAL_FINANCIAL_LEGAL',
  ])
  async handle(
    @Body(bodyValidationPipe) body: UpdateCustomerDto,
    @Param('id') id: string,
  ) {
    const {
      accumulatedInvestment,
      contractDuration,
      contractObjective,
      contractValue,
      contractedServices,
      expenditureProjection,
    } = body

    const payload: CustomerEditProps = {
      accumulatedInvestment,
      contractDuration,
      contractObjective,
      contractValue,
      contractedServices,
      expenditureProjection,
    }

    const result = await this.updateCustomerUseCase.execute({
      id,
      customer: payload,
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
  }
}
