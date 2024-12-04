import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Param,
  Put,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'
import { z } from 'zod'
import { Roles } from '@/infra/auth/roles.decorator'
import { UpdateProjectDto } from './dto/update-project-dto'
import { StatusProject } from '@prisma/client'
import { ProjectNotFoundError } from '@/domain/project/application/use-cases/errors/project-not-found-error'
import { EditProjectProps } from '@/core/types/edit-project-props'
import { UpdateProjectUseCase } from '@/domain/project/application/use-cases/update-project'

const StatusProjectEnum = z.enum([
  'APPROVED',
  'DISAPPROVED',
  'WAITING',
  'CANCELED',
  'DONE',
  'IN_PROGRESS',
])

const updateProjectBodySchema = z
  .object({
    name: z.string().optional(),
    deadline: z.coerce.date().optional(),
    statusProject: StatusProjectEnum.optional(),
    customerId: z.string().optional(),
    updatedAt: z.coerce.date().optional(),
    budget: z.number().optional(),
  })
  .refine(
    (data) => {
      const keys = Object.keys(data)
      return keys.some((key) => data[key] !== undefined)
    },
    {
      message: 'Pelo menos um dos atributos deve estar presente.',
    },
  )

const bodyValidationPipe = new ZodValidationPipe(updateProjectBodySchema)

@ApiTags('project')
@Controller('/project/update/:id')
export class UpdateProjectController {
  constructor(private updateProjectUseCase: UpdateProjectUseCase) {}

  @Put()
  @HttpCode(201)
  @Roles([
    'INTERNAL_MANAGEMENT',
    'INTERNAL_PARTNERS',
    'INTERNAL_FINANCIAL_LEGAL',
  ])
  async handle(
    @Body(bodyValidationPipe) body: UpdateProjectDto,
    @Param('id') id: string,
  ) {
    const { name, deadline, statusProject, customerId, updatedAt, budget } =
      body

    const project: EditProjectProps = {
      name,
      deadline: deadline ?? undefined,
      statusProject,
      customerId,
      updatedAt: updatedAt ?? undefined,
      budget,
    }

    const result = await this.updateProjectUseCase.execute({
      id,
      project,
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
  }
}
