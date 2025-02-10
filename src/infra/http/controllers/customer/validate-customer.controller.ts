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
import { ValidateCustomerUseCase } from '@/domain/project/application/use-cases/validate-customer'
import { ValidateCustomerDto } from './dto/validate-dto'
import { ExistCustomerSameCnpjError } from '@/domain/project/application/use-cases/errors/exist-customer-same-cnpj-error'
import { ExistCustomerSameNameError } from '@/domain/project/application/use-cases/errors/exist-customer-same-name-error'
import { ExistCustomerSameCorporateNameError } from '@/domain/project/application/use-cases/errors/exist-customer-same-corporate-name-error'

const CNPJSchema = z
  .string()
  .refine((value) => /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/.test(value), {
    message: 'CNPJ inválido',
  })

const validateCustomerBodySchema = z.object({
  name: z.string(),
  corporateName: z.string(),
  cnpj: CNPJSchema,
})

const bodyValidationPipe = new ZodValidationPipe(validateCustomerBodySchema)

@ApiTags('customer')
@Controller('/validate-customer')
export class ValidateCustomerController {
  constructor(private ValidateCustomerUseCase: ValidateCustomerUseCase) {}

  @Post()
  @HttpCode(200)
  @Roles([
    'INTERNAL_MANAGEMENT',
    'INTERNAL_PARTNERS',
    'INTERNAL_FINANCIAL_LEGAL',
  ])
  async handle(@Body(bodyValidationPipe) body: ValidateCustomerDto) {
    const { name, corporateName, cnpj } = body

    const result = await this.ValidateCustomerUseCase.execute({
      name,
      corporateName,
      cnpj,
    })

    if (result.isLeft()) {
      const error = result.value
      console.log(error)
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
  }
}
