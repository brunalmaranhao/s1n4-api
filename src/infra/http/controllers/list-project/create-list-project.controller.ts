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
import { CreateListProjectDto } from './dto/create-list-project-dto'
import { CreateListProjectUseCase } from '@/domain/project/application/use-cases/create-list-project'
import { ListProjectAlreadyExistsError } from '@/domain/project/application/use-cases/errors/list-project-already-exists'

const createListProjectBodySchema = z.object({
  name: z.string(),
  customerId: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(createListProjectBodySchema)

@ApiTags('list-project')
@Controller('/list-project')
export class CreateListProjectController {
  constructor(private createListProjectUseCase: CreateListProjectUseCase) {}

  @Post()
  @HttpCode(201)
  @Roles([
    'INTERNAL_MANAGEMENT',
    'INTERNAL_PARTNERS',
    'INTERNAL_FINANCIAL_LEGAL',
  ])
  async handle(@Body(bodyValidationPipe) body: CreateListProjectDto) {
    const result = await this.createListProjectUseCase.execute({
      name: body.name,
      customerId: body.customerId,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ListProjectAlreadyExistsError:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    const { listProject } = result.value

    return { listProjectId: listProject.id.toString() }
  }
}
