import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'
import { Roles } from '@/infra/auth/roles.decorator'
import { z } from 'zod'
import { CreateProjectDto } from './dto/create-project-dto'
import { ProjectAlreadyExistsError } from '@/domain/project/application/use-cases/errors/project-already-exists'
import { CreateProjectUseCase } from '@/domain/project/application/use-cases/create-project'

const createProjectBodySchema = z.object({
  name: z.string(),
  start: z.coerce.date().optional(),
  deadline: z.coerce.date().optional(),
  customerId: z.string(),
  budget: z.number(),
  listProjectsId: z.string(),
  description: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(createProjectBodySchema)

@ApiTags('project')
@Controller('/project')
export class CreateProjectController {
  constructor(private createProjectUseCase: CreateProjectUseCase) {}

  @Post()
  @HttpCode(201)
  @Roles([
    'INTERNAL_MANAGEMENT',
    'INTERNAL_PARTNERS',
    'INTERNAL_FINANCIAL_LEGAL',
  ])
  async handle(@Body(bodyValidationPipe) body: CreateProjectDto) {
    const {
      name,
      customerId,
      deadline,
      budget,
      start,
      listProjectsId,
      description,
    } = body

    const result = await this.createProjectUseCase.execute({
      name,
      customerId,
      start,
      deadline,
      budget,
      listProjectsId,
      description,
    })

    if (result.isLeft()) {
      const error = result.value
      console.log(error)
      switch (error.constructor) {
        case ProjectAlreadyExistsError:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    const { project } = result.value

    return { projectId: project.id.toString() }
  }
}
