import { z } from 'zod'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'
import { ApiTags } from '@nestjs/swagger'
import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
} from '@nestjs/common'
import { Roles } from '@/infra/auth/roles.decorator'
import { CreateCustomerUseCase } from '@/domain/project/application/use-cases/create-customer'
import { CreateCustomerDto } from './dto/customer-dto'
import { CustomerProps } from '@/domain/project/enterprise/entities/customer'
import { CurrentUser } from '@/infra/auth/currrent-user.decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { ExistCustomerSameCorporateNameError } from '@/domain/project/application/use-cases/errors/exist-customer-same-corporate-name-error'
import { ExistCustomerSameNameError } from '@/domain/project/application/use-cases/errors/exist-customer-same-name-error'
import { ExistCustomerSameCnpjError } from '@/domain/project/application/use-cases/errors/exist-customer-same-cnpj-error'

const PaymentMethodSchema = z.enum(['CREDIT_CARD', 'PIX'])

const CNPJSchema = z
  .string()
  .refine((value) => /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/.test(value), {
    message: 'CNPJ inválido',
  })

const createCustomerBodySchema = z.object({
  name: z.string(),
  corporateName: z.string(),
  cnpj: CNPJSchema,
  contractDuration: z.string().optional(),
  contractValue: z.number().optional(),
  paymentMethods: PaymentMethodSchema.optional(),
  accumulatedInvestment: z.number().optional(),
  expenditureProjection: z.number().optional(),
  contractObjective: z.string().optional(),
  contractedServices: z.string().optional(),
})

const bodyValidationPipe = new ZodValidationPipe(createCustomerBodySchema)

@ApiTags('customer')
@Controller('/customer')
export class CreateCustomerController {
  constructor(private createCustomerUseCase: CreateCustomerUseCase) {}

  @Post()
  @HttpCode(201)
  @Roles([
    'INTERNAL_MANAGEMENT',
    'INTERNAL_PARTNERS',
    'INTERNAL_FINANCIAL_LEGAL',
  ])
  async handle(
    @Body(bodyValidationPipe) body: CreateCustomerDto,
    @CurrentUser() user: UserPayload,
  ) {
    const {
      name,
      corporateName,
      cnpj,
      accumulatedInvestment,
      contractDuration,
      contractObjective,
      contractValue,
      contractedServices,
      expenditureProjection,
    } = body

    const customer: CustomerProps = {
      name,
      corporateName,
      cnpj,
      accumulatedInvestment,
      contractDuration,
      contractObjective,
      contractValue,
      contractedServices,
      expenditureProjection,
      status: 'ACTIVE',
    }

    const result = await this.createCustomerUseCase.execute({ customer })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ExistCustomerSameCnpjError:
          throw new ConflictException({
            message: 'Conflict',
            statusCode: 409,
            errors: {
              details: [
                {
                  code: 'custom',
                  message: error.message,
                  path: 'username',
                },
              ],
            },
          })
        case ExistCustomerSameNameError:
          throw new ConflictException({
            message: 'Conflict',
            statusCode: 409,
            errors: {
              details: [
                {
                  code: 'custom',
                  message: error.message,
                  path: 'username',
                },
              ],
            },
          })
        case ExistCustomerSameCorporateNameError:
          throw new ConflictException({
            message: 'Conflict',
            statusCode: 409,
            errors: {
              details: [
                {
                  code: 'custom',
                  message: error.message,
                  path: 'username',
                },
              ],
            },
          })
        default:
          throw new BadRequestException(error.message)
      }
    }

    const { customer: newCustomer } = result.value

    return { customerId: newCustomer.id.toString() }
  }
}
