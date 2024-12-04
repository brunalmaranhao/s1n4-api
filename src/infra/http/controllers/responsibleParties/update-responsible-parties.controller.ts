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
import { UpdateResponsiblePartiesUseCase } from '@/domain/project/application/use-cases/update-responsible-parties'
import { UpdateResponsiblePartiesDto } from './dto/update-responsible-dto'
import { ResponsiblePartiesEditProps } from '@/core/types/responsilbe-parties-props'
import { ResponsiblePartiesNotFoundError } from '@/domain/project/application/use-cases/errors/responsible-not-found-error'

const updateResponsiblePartiesSchema = z
  .object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    email: z.string().email().optional(),
    phone: z.string().optional(),
    birthdate: z.coerce.date().optional(),
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

const bodyValidationPipe = new ZodValidationPipe(updateResponsiblePartiesSchema)

@ApiTags('responsible-parties')
@Controller('/responsible-parties/update/:id')
export class UpdateResponsiblePartiesController {
  constructor(
    private updateResponsiblePartiesUseCase: UpdateResponsiblePartiesUseCase,
  ) {}

  @Put()
  @HttpCode(201)
  @Roles([
    'INTERNAL_MANAGEMENT',
    'INTERNAL_PARTNERS',
    'INTERNAL_FINANCIAL_LEGAL',
  ])
  async handle(
    @Body(bodyValidationPipe) body: UpdateResponsiblePartiesDto,
    @Param('id') id: string,
  ) {
    const { firstName, birthdate, email, lastName, phone } = body

    const payload: ResponsiblePartiesEditProps = {
      firstName,
      birthdate,
      email,
      lastName,
      phone,
    }

    const result = await this.updateResponsiblePartiesUseCase.execute({
      id,
      responsibleParties: payload,
    })

    if (result.isLeft()) {
      const error = result.value
      switch (error.constructor) {
        case ResponsiblePartiesNotFoundError:
          throw new BadRequestException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
