import {
  BadRequestException,
  Controller,
  HttpCode,
  ConflictException,
  Delete,
  Param,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { Roles } from '@/infra/auth/roles.decorator'
import { RemoveProjectUpdatesUseCase } from '@/domain/project/application/use-cases/remove-project-updates'
import { ProjectUpdatesNotFoundError } from '@/domain/project/application/use-cases/errors/project-updates-not-found-error'

@ApiTags('project-updates')
@Controller('/project-updates/:id')
export class RemoveProjectUpdateController {
  constructor(
    private removeProjectUpdateUseCase: RemoveProjectUpdatesUseCase,
  ) {}

  @Delete()
  @HttpCode(204)
  @Roles([
    'INTERNAL_MANAGEMENT',
    'INTERNAL_PARTNERS',
    'INTERNAL_FINANCIAL_LEGAL',
  ])
  async handle(@Param('id') id: string) {
    const result = await this.removeProjectUpdateUseCase.execute({
      id,
    })

    if (result.isLeft()) {
      const error = result.value
      switch (error.constructor) {
        case ProjectUpdatesNotFoundError:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
