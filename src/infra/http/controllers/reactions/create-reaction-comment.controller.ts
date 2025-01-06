import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'
import { Roles } from '@/infra/auth/roles.decorator'
import { z } from 'zod'
import { CreateReactionCommentUseCase } from '@/domain/project/application/use-cases/create-reaction-comment'
import { CreateReactionCommentDto } from './dto/create-reaction-comment-dto'
import { CurrentUser } from '@/infra/auth/currrent-user.decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { EmojiNotFoundError } from '@/domain/project/application/use-cases/errors/emoji-not-found-error'

const createReactionCommentBodySchema = z.object({
  unified: z.string(),
  commentId: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(
  createReactionCommentBodySchema,
)

@ApiTags('reaction')
@Controller('/reaction/comment')
export class CreateReactionCommentController {
  constructor(
    private createReactionCommentUseCase: CreateReactionCommentUseCase,
  ) {}

  @Post()
  @HttpCode(201)
  async handle(
    @Body(bodyValidationPipe) body: CreateReactionCommentDto,
    @CurrentUser() user: UserPayload,
  ) {
    const { commentId, unified } = body

    const result = await this.createReactionCommentUseCase.execute({
      unified,
      commentId,
      userId: user.sub,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case EmojiNotFoundError:
          throw new BadRequestException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
