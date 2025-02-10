import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
  UnauthorizedException,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'
import { Roles } from '@/infra/auth/roles.decorator'
import { z } from 'zod'
import { ProjectNotFoundError } from '@/domain/project/application/use-cases/errors/project-not-found-error'
import { AddOrRemoveTagToProjectDto } from './dto/add-tag-to-project-dto'
import { TagNotFoundError } from '@/domain/project/application/use-cases/errors/tag-not-found-error'
import { RemoveTagFromProjectUseCase } from '@/domain/project/application/use-cases/remove-tag-project'

const removeTagFromProjectBodySchema = z.object({
  tagId: z.string(),
  projectId: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(removeTagFromProjectBodySchema)

@ApiTags('project')
@Controller('/project/tag/remove')
export class RemoveTagFromProjectController {
  constructor(
    private removeTagFromProjectUseCase: RemoveTagFromProjectUseCase,
  ) {}

  @Post()
  @HttpCode(200)
  @Roles([
    'INTERNAL_MANAGEMENT',
    'INTERNAL_PARTNERS',
    'INTERNAL_FINANCIAL_LEGAL',
  ])
  async handle(@Body(bodyValidationPipe) body: AddOrRemoveTagToProjectDto) {
    const result = await this.removeTagFromProjectUseCase.execute({
      projectId: body.projectId,
      tagId: body.tagId,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ProjectNotFoundError:
          throw new ConflictException(error.message)
        case TagNotFoundError:
          throw new ConflictException(error.message)
        case UnauthorizedException:
          throw new UnauthorizedException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
