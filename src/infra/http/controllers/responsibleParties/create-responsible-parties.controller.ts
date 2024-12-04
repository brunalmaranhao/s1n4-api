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
import { CreateResponsiblePartiesDto } from './dto/create-responsible-dto'
import { ExistResponsiblePartiesError } from '@/domain/project/application/use-cases/errors/exist-responsible-parties'
import { CreateResponsiblePartiesUseCase } from '@/domain/project/application/use-cases/create-responsible-parties'

const ResponsiblePartiesRoleEnum = z.enum([
  'INFLUENCERS',
  'CODE',
  'RISKMANAGEMENT',
  'OWNER',
])

const createResponsiblePartiesBodySchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  phone: z.string(),
  customerId: z.string(),
  birthdate: z.coerce.date(),
  responsiblePartiesRole: z.array(ResponsiblePartiesRoleEnum).optional(),
})

const bodyValidationPipe = new ZodValidationPipe(
  createResponsiblePartiesBodySchema,
)

@ApiTags('responsible-parties')
@Controller('/responsible-parties')
export class CreateResponsiblePartiesController {
  constructor(
    private createResponsiblePartiesUseCase: CreateResponsiblePartiesUseCase,
  ) {}

  @Post()
  @HttpCode(201)
  @Roles([
    'INTERNAL_MANAGEMENT',
    'INTERNAL_PARTNERS',
    'INTERNAL_FINANCIAL_LEGAL',
  ])
  async handle(@Body(bodyValidationPipe) body: CreateResponsiblePartiesDto) {
    const {
      firstName,
      lastName,
      email,
      phone,
      birthdate,
      customerId,
      responsiblePartiesRole,
    } = body

    const result = await this.createResponsiblePartiesUseCase.execute({
      firstName,
      lastName,
      email,
      phone,
      birthdate,
      customerId,
      responsiblePartiesRole,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ExistResponsiblePartiesError:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    const { responsible } = result.value

    return { responsibleId: responsible.id.toString() }
  }
}
