import { ApiTags } from '@nestjs/swagger'
import {
  BadRequestException,
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  Param,
} from '@nestjs/common'
import { CurrentUser } from '@/infra/auth/currrent-user.decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { ProjectUpdatesPresenter } from '../../presenter/project-updates.presenter'
import { FetchProjectUpdateByProjectUseCase } from '@/domain/project/application/use-cases/fetch-project-updates-by-project'

@ApiTags('project-updates')
@Controller('/project-updates/project/:id')
export class FetchActivesProjectUpdatesByProjectController {
  constructor(
    private fetchProjectUpdateByProjectUseCase: FetchProjectUpdateByProjectUseCase,
  ) {}

  @Get()
  @HttpCode(200)
  async handle(@CurrentUser() user: UserPayload, @Param('id') id: string) {
    const result = await this.fetchProjectUpdateByProjectUseCase.execute({
      projectId: id,
      userId: user.sub,
    })

    if (result.isLeft()) {
      const error = result.value
      switch (error.constructor) {
        case ForbiddenException:
          throw new ForbiddenException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    const projectsUpdates = result.value.projectUpdates

    const updates = projectsUpdates.map(ProjectUpdatesPresenter.toHTTP)

    return { updates }
  }
}
