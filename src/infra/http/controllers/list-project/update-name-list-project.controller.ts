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
import { UpdateListProjectUseCase } from '@/domain/project/application/use-cases/update-list-project-name'
import { UpdateListProjectDto } from './dto/update-list-project-dto'
import { ListProjectNotFoundError } from '@/domain/project/application/use-cases/errors/list-project-not-found-error'

const updateListProjectBodySchema = z.object({
  id: z.string(),
  name: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(updateListProjectBodySchema)

@ApiTags('list-project')
@Controller('/list-project')
export class UpdateListProjectController {
  constructor(private updateListProjectUseCase: UpdateListProjectUseCase) {}

  @Patch()
  @HttpCode(201)
  @Roles([
    'INTERNAL_MANAGEMENT',
    'INTERNAL_PARTNERS',
    'INTERNAL_FINANCIAL_LEGAL',
  ])
  async handle(@Body(bodyValidationPipe) body: UpdateListProjectDto) {
    const result = await this.updateListProjectUseCase.execute({
      id: body.id,
      name: body.name,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ListProjectNotFoundError:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    const { listProject } = result.value

    return { listProjectId: listProject.id.toString() }
  }
}
