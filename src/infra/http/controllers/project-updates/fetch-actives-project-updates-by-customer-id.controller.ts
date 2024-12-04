import { ApiTags } from '@nestjs/swagger'
import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  Param,
  Query,
} from '@nestjs/common'
import { ProjectNotFoundError } from '@/domain/project/application/use-cases/errors/project-not-found-error'
import { CurrentUser } from '@/infra/auth/currrent-user.decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { FetchProjectUpdateByStatusUseCase } from '@/domain/project/application/use-cases/fetch-project-updates-by-status'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'
import { z } from 'zod'
import { PageQueryParamSchema } from '../project/fetch-recent-projects.controller'
import { ProjectUpdatesPresenter } from '../../presenter/project-updates.presenter'

const pageQueryParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

@ApiTags('project-updates')
@Controller('/project-updates/customer/:id')
export class FetchActivesProjectUpdatesController {
  constructor(
    private fetchProjectUpdateByStatusUseCase: FetchProjectUpdateByStatusUseCase,
  ) {}

  @Get()
  @HttpCode(200)
  async handle(
    @CurrentUser() user: UserPayload,
    @Query('page', queryValidationPipe) page: PageQueryParamSchema,
    @Param('id') id: string,
  ) {
    // CLIENT_RESPONSIBLE
    // CLIENT_OWNER
    // CLIENT_USER
    const shouldSendRequester = !!(
      user.role === 'CLIENT_RESPONSIBLE' ||
      user.role === 'CLIENT_OWNER' ||
      user.role === 'CLIENT_USER'
    )

    const result = await this.fetchProjectUpdateByStatusUseCase.execute({
      page,
      customerId: id,
      status: 'ACTIVE',
      requesterId: shouldSendRequester ? user.sub : undefined,
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

    const projectsUpdates = result.value.projectUpdates

    const updates = projectsUpdates.map(ProjectUpdatesPresenter.toHTTP)

    return { updates }
  }
}
