import {
  BadRequestException,
  Controller,
  HttpCode,
  ConflictException,
  Delete,
  Param,
  ForbiddenException,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { Roles } from '@/infra/auth/roles.decorator'
import { RemoveCommentUseCase } from '@/domain/project/application/use-cases/remove-comment'
import { CommentNotFoundError } from '@/domain/project/application/use-cases/errors/comment-not-found'
import { CurrentUser } from '@/infra/auth/currrent-user.decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'

@ApiTags('comment')
@Controller('/comment/:id')
export class RemoveCommentController {
  constructor(private removeCommentUseCase: RemoveCommentUseCase) {}

  @Delete()
  @HttpCode(204)
  async handle(@Param('id') id: string, @CurrentUser() user: UserPayload) {
    const result = await this.removeCommentUseCase.execute({
      id,
      authorId: user.sub,
    })

    if (result.isLeft()) {
      const error = result.value
      switch (error.constructor) {
        case CommentNotFoundError:
          throw new ConflictException(error.message)
        case ForbiddenException:
          throw new ForbiddenException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
