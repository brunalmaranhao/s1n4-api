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
import { ProjectNotFoundError } from '@/domain/project/application/use-cases/errors/project-not-found-error'
import { UpdateProjectNameDto } from './dto/update-project-name-dto'
import { UpdateProjectNameUseCase } from '@/domain/project/application/use-cases/update-project-name'

const updateProjectBodySchema = z.object({
  name: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(updateProjectBodySchema)

@ApiTags('project')
@Controller('/project/update-name/:id')
export class UpdateProjectNameController {
  constructor(private updateProjectNameUseCase: UpdateProjectNameUseCase) {}

  @Put()
  @HttpCode(201)
  @Roles([
    'INTERNAL_MANAGEMENT',
    'INTERNAL_PARTNERS',
    'INTERNAL_FINANCIAL_LEGAL',
  ])
  async handle(
    @Body(bodyValidationPipe) body: UpdateProjectNameDto,
    @Param('id') id: string,
  ) {
    const { name } = body

    const result = await this.updateProjectNameUseCase.execute({
      id,
      name,
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
