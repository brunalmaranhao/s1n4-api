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
import { RemoveTagUseCase } from '@/domain/project/application/use-cases/remove-tag'
import { TagNotFoundError } from '@/domain/project/application/use-cases/errors/tag-not-found-error'

@ApiTags('tag')
@Controller('/tag/:id')
export class RemoveTagController {
  constructor(private removeTagUseCase: RemoveTagUseCase) {}

  @Delete()
  @HttpCode(204)
  @Roles([
    'INTERNAL_MANAGEMENT',
    'INTERNAL_PARTNERS',
    'INTERNAL_FINANCIAL_LEGAL',
  ])
  async handle(@Param('id') id: string) {
    const result = await this.removeTagUseCase.execute({
      id,
    })

    if (result.isLeft()) {
      const error = result.value
      switch (error.constructor) {
        case TagNotFoundError:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
