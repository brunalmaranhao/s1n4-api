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
import { ListProjectNotFoundError } from '@/domain/project/application/use-cases/errors/list-project-not-found-error'
import { AddOrRemoveTagToProjectDto } from './dto/add-tag-to-project-dto'
import { FetchTagByIdUseCase } from '@/domain/project/application/use-cases/fetch-tag-by-id'
import { TagNotFoundError } from '@/domain/project/application/use-cases/errors/tag-not-found-error'
import { AddTagToProjectUseCase } from '@/domain/project/application/use-cases/add-tag-project'

const addTagToProjectBodySchema = z.object({
  tagId: z.string(),
  projectId: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(addTagToProjectBodySchema)

@ApiTags('project')
@Controller('/project/tag/add')
export class AddTagToProjectController {
  constructor(
    private addTagToProjectUseCase: AddTagToProjectUseCase,
    private fetchTagById: FetchTagByIdUseCase,
  ) {}

  @Post()
  @HttpCode(201)
  @Roles([
    'INTERNAL_MANAGEMENT',
    'INTERNAL_PARTNERS',
    'INTERNAL_FINANCIAL_LEGAL',
  ])
  async handle(@Body(bodyValidationPipe) body: AddOrRemoveTagToProjectDto) {
    const resultTag = await this.fetchTagById.execute({ id: body.tagId })

    if (resultTag.isLeft()) {
      const error = resultTag.value

      switch (error.constructor) {
        case TagNotFoundError:
          throw new ConflictException(error.message)
        case ListProjectNotFoundError:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    const { tag } = resultTag.value

    const result = await this.addTagToProjectUseCase.execute({
      projectId: body.projectId,
      tag,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ProjectNotFoundError:
          throw new ConflictException(error.message)
        case UnauthorizedException:
          throw new UnauthorizedException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
