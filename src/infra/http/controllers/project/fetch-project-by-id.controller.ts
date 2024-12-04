import { ApiTags } from '@nestjs/swagger'
import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  Param,
  Query,
} from '@nestjs/common'
import { Roles } from '@/infra/auth/roles.decorator'
import { Status } from '@prisma/client'
import { ResponsiblePartiesPresenter } from '../../presenter/responsible-parties'
import { ProjectNotFoundError } from '@/domain/project/application/use-cases/errors/project-not-found-error'
import { ProjectPresenter } from '../../presenter/project-presenter'
import { FetchProjectByIdUseCase } from '@/domain/project/application/use-cases/fetch-project-by-id'

@ApiTags('project')
@Controller('/project/id/:id')
export class FetchProjectByIdController {
  constructor(private fetchProjectByIdUseCase: FetchProjectByIdUseCase) {}

  @Get()
  @HttpCode(200)
  @Roles([
    'INTERNAL_MANAGEMENT',
    'INTERNAL_PARTNERS',
    'INTERNAL_FINANCIAL_LEGAL',
  ])
  async handle(@Param('id') id: string) {
    const result = await this.fetchProjectByIdUseCase.execute({
      id,
    })

    if (result.isLeft()) {
      const error = result.value
      switch (error.constructor) {
        case ProjectNotFoundError:
          throw new BadRequestException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    const projectById = result.value.project

    const project = ProjectPresenter.toHTTP(projectById)

    return { project }
  }
}
