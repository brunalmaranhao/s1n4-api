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
import { RemoveReactionCommentUseCase } from '@/domain/project/application/use-cases/remove-reaction-comment'
import { ReactionNotFoundError } from '@/domain/project/application/use-cases/errors/reaction-not-found-error'

@ApiTags('reaction')
@Controller('/reaction/comment/:id')
export class RemoveReactionCommentController {
  constructor(
    private removeReactionCommentUseCase: RemoveReactionCommentUseCase,
  ) {}

  @Delete()
  @HttpCode(204)
  async handle(@Param('id') id: string, @CurrentUser() user: UserPayload) {
    const result = await this.removeReactionCommentUseCase.execute({
      commentId: id,
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
