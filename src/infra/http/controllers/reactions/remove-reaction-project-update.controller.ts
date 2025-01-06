import {
  BadRequestException,
  Controller,
  HttpCode,
  Delete,
  Param,
  ForbiddenException,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { CurrentUser } from '@/infra/auth/currrent-user.decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { ReactionNotFoundError } from '@/domain/project/application/use-cases/errors/reaction-not-found-error'
import { RemoveReactionProjectUpdateUseCase } from '@/domain/project/application/use-cases/remove-reaction-project-update'

@ApiTags('reaction')
@Controller('/reaction/project-update/:id')
export class RemoveReactionProjectUpdateController {
  constructor(
    private removeReactionProjectUpdateUseCase: RemoveReactionProjectUpdateUseCase,
  ) {}

  @Delete()
  @HttpCode(204)
  async handle(@Param('id') id: string, @CurrentUser() user: UserPayload) {
    const result = await this.removeReactionProjectUpdateUseCase.execute({
      projectUpdateId: id,
      userId: user.sub,
    })

    if (result.isLeft()) {
      const error = result.value
      console.log(error)
      switch (error.constructor) {
        case ReactionNotFoundError:
          throw new BadRequestException(error.message)
        case ForbiddenException:
          throw new ForbiddenException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
