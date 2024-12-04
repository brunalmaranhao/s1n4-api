import { z } from 'zod'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'
import { ApiTags } from '@nestjs/swagger'
import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
  Query,
} from '@nestjs/common'
import { Roles } from '@/infra/auth/roles.decorator'
import { FetchProjectByStatusDto } from './dto/fetch-project-by-status-dto'
import { FetchProjectByStatusUseCase } from '@/domain/project/application/use-cases/fetch-project-by-status'
import { ProjectPresenter } from '../../presenter/project-presenter'

const pageQueryParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>

const StatusProjectEnum = z.enum([
  'APPROVED',
  'DISAPPROVED',
  'WAITING',
  'CANCELED',
  'DONE',
])

const fetchProjectByStatusBodySchema = z.object({
  statusProject: StatusProjectEnum,
})

const bodyValidationPipe = new ZodValidationPipe(fetchProjectByStatusBodySchema)

@ApiTags('project')
@Controller('/project/by-status')
export class FetchProjectByStatusController {
  constructor(
    private fetchProjectByStatusUseCase: FetchProjectByStatusUseCase,
  ) {}

  @Post()
  @HttpCode(200)
  @Roles([
    'INTERNAL_MANAGEMENT',
    'INTERNAL_PARTNERS',
    'INTERNAL_FINANCIAL_LEGAL',
  ])
  async handle(
    @Query('page', queryValidationPipe) page: PageQueryParamSchema,
    @Body(bodyValidationPipe) body: FetchProjectByStatusDto,
  ) {
    const { statusProject } = body

    const result = await this.fetchProjectByStatusUseCase.execute({
      page,
      statusProject,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const projectsByStatus = result.value.projects

    const projects = projectsByStatus.map(ProjectPresenter.toHTTP)

    return { projects }
  }
}
