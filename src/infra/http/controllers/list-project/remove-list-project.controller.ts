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
import { ProjectNotFoundError } from '@/domain/project/application/use-cases/errors/project-not-found-error'
import { ProjectAlreadyCanceledError } from '@/domain/project/application/use-cases/errors/project-already-canceled-error'
import { RemoveListProjectUseCase } from '@/domain/project/application/use-cases/remove-list-project'

@ApiTags('list-project')
@Controller('/list-project/:id')
export class RemoveListProjectController {
  constructor(private removeListProjectUseCase: RemoveListProjectUseCase) {}

  @Delete()
  @HttpCode(204)
  @Roles([
    'INTERNAL_MANAGEMENT',
    'INTERNAL_PARTNERS',
    'INTERNAL_FINANCIAL_LEGAL',
  ])
  async handle(@Param('id') id: string) {
    const result = await this.removeListProjectUseCase.execute({
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
