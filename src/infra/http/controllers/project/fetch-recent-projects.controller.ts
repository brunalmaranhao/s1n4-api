import { z } from 'zod'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'
import {
  BadRequestException,
  Controller,
  Get,
  Query,
  HttpCode,
} from '@nestjs/common'
import { FetchRecentProjectsUseCase } from '@/domain/project/application/use-cases/fetch-recent-projects'
import { ProjectPresenter } from '../../presenter/project-presenter'
import { Roles } from '@/infra/auth/roles.decorator'
import { ApiTags } from '@nestjs/swagger'

const pageQueryParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))

export type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

const sizeQueryParamSchema = z
  .string()
  .optional()
  .default('10')
  .transform(Number)
  .pipe(z.number().min(1))

export type SizeQueryParamSchema = z.infer<typeof sizeQueryParamSchema>

const querySizeValidationPipe = new ZodValidationPipe(sizeQueryParamSchema)

@ApiTags('project')
@Controller('/project')
export class FetchRecentProjectsController {
  constructor(private fetchRecentProjectsUseCase: FetchRecentProjectsUseCase) {}

  @Get()
  @HttpCode(200)
  @Roles([
    'INTERNAL_MANAGEMENT',
    'INTERNAL_PARTNERS',
    'INTERNAL_FINANCIAL_LEGAL',
  ])
  async handlePost(
    @Query('page', queryValidationPipe) page: PageQueryParamSchema,
    @Query('size', querySizeValidationPipe) size: SizeQueryParamSchema,
  ) {
    const result = await this.fetchRecentProjectsUseCase.execute({
      page,
      size,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const projects = result.value.projects
    // console.log(projects)

    // console.log(projects.map(ProjectPresenter.toHTTP));

    return { projects: projects.map(ProjectPresenter.toHTTP) }
  }
}
