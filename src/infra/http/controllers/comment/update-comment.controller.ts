import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  HttpCode,
  Param,
  Patch,
  Put,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'
import { z } from 'zod'
import { Roles } from '@/infra/auth/roles.decorator'
import { UpdateCommentUseCase } from '@/domain/project/application/use-cases/update-comment'
import { UpdateCommentDto } from './dto/update-comment-dto'
import { CurrentUser } from '@/infra/auth/currrent-user.decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { CommentNotFoundError } from '@/domain/project/application/use-cases/errors/comment-not-found'

const updateCommentBodySchema = z.object({
  content: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(updateCommentBodySchema)

@ApiTags('comment')
@Controller('/comment/update/:id')
export class UpdateCommentController {
  constructor(private updateCommentUseCase: UpdateCommentUseCase) {}

  @Put()
  @HttpCode(204)
  async handle(
    @Body(bodyValidationPipe) body: UpdateCommentDto,
    @Param('id') id: string,
    @CurrentUser() user: UserPayload,
  ) {
    const { content } = body

    const result = await this.updateCommentUseCase.execute({
      id,
      authorId: user.sub,
      content,
    })

    if (result.isLeft()) {
      const error = result.value
      switch (error.constructor) {
        case CommentNotFoundError:
          throw new BadRequestException(error.message)

        case ForbiddenException:
          throw new ForbiddenException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
