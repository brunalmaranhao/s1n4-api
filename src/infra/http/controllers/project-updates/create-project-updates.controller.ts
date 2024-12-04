import { z } from 'zod'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'
import { ApiTags } from '@nestjs/swagger'
import { Body, Controller, HttpCode, Post } from '@nestjs/common'
import { Roles } from '@/infra/auth/roles.decorator'
import { CurrentUser } from '@/infra/auth/currrent-user.decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { CreateProjectUpdateUseCase } from '@/domain/project/application/use-cases/create-project-updates'
import { CreateProjectUpdateDto } from './dto/create-project-update-dto'

const createProjectUpdateBodySchema = z.object({
  description: z.string(),
  projectId: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(createProjectUpdateBodySchema)

@ApiTags('project-updates')
@Controller('/project-updates')
export class CreateProjectUpdateController {
  constructor(private createProjectUpdateUseCase: CreateProjectUpdateUseCase) {}

  @Post()
  @HttpCode(201)
  @Roles([
    'INTERNAL_MANAGEMENT',
    'INTERNAL_PARTNERS',
    'INTERNAL_FINANCIAL_LEGAL',
  ])
  async handle(
    @Body(bodyValidationPipe) body: CreateProjectUpdateDto,
    @CurrentUser() user: UserPayload,
  ) {
    const { projectId, description } = body

    await this.createProjectUpdateUseCase.execute({
      description,
      projectId,
      userId: user.sub,
    })
  }
}
