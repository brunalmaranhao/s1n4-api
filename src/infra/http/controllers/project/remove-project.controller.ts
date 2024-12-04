import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  ConflictException,
  Delete,
  Param,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { Roles } from '@/infra/auth/roles.decorator'
import { ProjectNotFoundError } from '@/domain/project/application/use-cases/errors/project-not-found-error'
import { RemoveProjectUseCase } from '@/domain/project/application/use-cases/remove-project'
import { ProjectAlreadyCanceledError } from '@/domain/project/application/use-cases/errors/project-already-canceled-error'

@ApiTags('project')
@Controller('/project/:id')
export class RemoveProjectController {
  constructor(private removeProjectUseCase: RemoveProjectUseCase) {}

  @Delete()
  @HttpCode(204)
  @Roles([
    'INTERNAL_MANAGEMENT',
    'INTERNAL_PARTNERS',
    'INTERNAL_FINANCIAL_LEGAL',
  ])
  async handle(@Param('id') id: string) {
    const result = await this.removeProjectUseCase.execute({
      id,
    })

    if (result.isLeft()) {
      const error = result.value
      switch (error.constructor) {
        case ProjectNotFoundError:
          throw new ConflictException(error.message)
        case ProjectAlreadyCanceledError:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
