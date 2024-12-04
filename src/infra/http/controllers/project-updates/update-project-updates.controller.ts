import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Param,
  Patch,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { ApiTags } from '@nestjs/swagger'
import { Roles } from '@/infra/auth/roles.decorator'
import { UpdateProjectUpdateDto } from './dto/update-project-update-dto'
import { UpdateProjectUpdateUseCase } from '@/domain/project/application/use-cases/update-project-update'
import { ProjectUpdatesNotFoundError } from '@/domain/project/application/use-cases/errors/project-updates-not-found-error'

const updateProjectUpdatesSchema = z.object({
  description: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(updateProjectUpdatesSchema)

@ApiTags('project-updates')
@Controller('/project-updates/update/:id')
export class UpdateProjectUpdatesController {
  constructor(
    private updateProjectUpdatesUseCase: UpdateProjectUpdateUseCase,
  ) {}

  @Patch()
  @HttpCode(201)
  @Roles([
    'INTERNAL_MANAGEMENT',
    'INTERNAL_PARTNERS',
    'INTERNAL_FINANCIAL_LEGAL',
  ])
  async handle(
    @Body(bodyValidationPipe) body: UpdateProjectUpdateDto,
    @Param('id') id: string,
  ) {
    const { description } = body

    const result = await this.updateProjectUpdatesUseCase.execute({
      id,
      description,
    })

    if (result.isLeft()) {
      const error = result.value
      switch (error.constructor) {
        case ProjectUpdatesNotFoundError:
          throw new BadRequestException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
