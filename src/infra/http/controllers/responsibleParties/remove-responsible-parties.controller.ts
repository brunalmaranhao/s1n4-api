import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  ConflictException,
  Delete,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { ApiTags } from '@nestjs/swagger'
import { Roles } from '@/infra/auth/roles.decorator'
import { RemoveResponsiblePartiesUseCase } from '@/domain/project/application/use-cases/remove-responsible-parties'
import { RemoveResponsiblePartiesDto } from './dto/remove-user-dto'
import { ResponsiblePartiesNotFoundError } from '@/domain/project/application/use-cases/errors/responsible-not-found-error'

const removeResponsiblePartiesBodySchema = z.object({
  id: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(
  removeResponsiblePartiesBodySchema,
)

@ApiTags('responsible-parties')
@Controller('/responsible-parties')
export class RemoveResponsiblePartiesController {
  constructor(
    private removeResponsiblePartiesUseCase: RemoveResponsiblePartiesUseCase,
  ) {}

  @Delete()
  @HttpCode(204)
  @Roles([
    'INTERNAL_MANAGEMENT',
    'INTERNAL_PARTNERS',
    'INTERNAL_FINANCIAL_LEGAL',
  ])
  async handle(@Body(bodyValidationPipe) body: RemoveResponsiblePartiesDto) {
    const { id } = body

    const result = await this.removeResponsiblePartiesUseCase.execute({
      id,
    })

    if (result.isLeft()) {
      const error = result.value
      switch (error.constructor) {
        case ResponsiblePartiesNotFoundError:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
