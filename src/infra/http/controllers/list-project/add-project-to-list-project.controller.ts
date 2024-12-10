import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Patch,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'
import { Roles } from '@/infra/auth/roles.decorator'
import { z } from 'zod'
import { AddProjectListProjectUseCase } from '@/domain/project/application/use-cases/add-project-list-project'
import { AddProjectToListProjectDto } from './dto/add-project-list-project-dto'
import { ProjectNotFoundError } from '@/domain/project/application/use-cases/errors/project-not-found-error'
import { ListProjectNotFoundError } from '@/domain/project/application/use-cases/errors/list-project-not-found-error'

const updateListProjectBodySchema = z.object({
  listProjectId: z.string(),
  projectId: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(updateListProjectBodySchema)

@ApiTags('list-project')
@Controller('/list-project/add-project')
export class AddProjectToListProjectController {
  constructor(
    private addProjectListProjecyUseCase: AddProjectListProjectUseCase,
  ) {}

  @Patch()
  @HttpCode(201)
  @Roles([
    'INTERNAL_MANAGEMENT',
    'INTERNAL_PARTNERS',
    'INTERNAL_FINANCIAL_LEGAL',
  ])
  async handle(@Body(bodyValidationPipe) body: AddProjectToListProjectDto) {
    const result = await this.addProjectListProjecyUseCase.execute({
      projectId: body.projectId,
      listProjectId: body.listProjectId,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ProjectNotFoundError:
          throw new ConflictException(error.message)
        case ListProjectNotFoundError:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
