import { ApiTags } from '@nestjs/swagger'
import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  Param,
  Query,
} from '@nestjs/common'

import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'
import { z } from 'zod'
import { PageQueryParamSchema } from '../project/fetch-recent-projects.controller'
import { ProjectUpdatesPresenter } from '../../presenter/project-updates.presenter'
import { FetchAllProjectUpdatesUseCase } from '@/domain/project/application/use-cases/fetch-all-project-updates'
import { Roles } from '@/infra/auth/roles.decorator'

const pageQueryParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

@ApiTags('project-updates')
@Controller('/project-updates')
export class FetchAllProjectUpdatesController {
  constructor(
    private fetchAllProjectUpdatesUseCase: FetchAllProjectUpdatesUseCase,
  ) {}

  @Get()
  @HttpCode(200)
  @Roles([
    'INTERNAL_MANAGEMENT',
    'INTERNAL_PARTNERS',
    'INTERNAL_FINANCIAL_LEGAL',
  ])
  async handle(@Query('page', queryValidationPipe) page: PageQueryParamSchema) {
    const result = await this.fetchAllProjectUpdatesUseCase.execute({
      page,
      status: 'ACTIVE',
    })

    if (result.isLeft()) {
      return null
    }

    const projectsUpdates = result.value.projectUpdates

    const updates = projectsUpdates.map(ProjectUpdatesPresenter.toHTTP)

    return { updates }
  }
}
