import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  HttpCode,
  Post,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'
import { Roles } from '@/infra/auth/roles.decorator'
import { z } from 'zod'
import { CreateCommentUseCase } from '@/domain/project/application/use-cases/create-comment'
import { CreateCommentDto } from './dto/create-comment-dto'
import { CurrentUser } from '@/infra/auth/currrent-user.decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { Permissions } from '@/infra/auth/permissions.decorator'

const createCommentBodySchema = z.object({
  content: z.string(),
  projectUpdateId: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(createCommentBodySchema)

@ApiTags('comment')
@Controller('/comment')
export class CreateCommentController {
  constructor(private createCommentUseCase: CreateCommentUseCase) {}

  @Post()
  @HttpCode(201)
  @Permissions(['CREATE_COMMENT'])
  async handle(
    @Body(bodyValidationPipe) body: CreateCommentDto,
    @CurrentUser() user: UserPayload,
  ) {
    const { content, projectUpdateId } = body

    const result = await this.createCommentUseCase.execute({
      authorId: user.sub,
      content,
      projectUpdateId,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ForbiddenException:
          throw new ForbiddenException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    const { comment } = result.value

    return { commentId: comment.id.toString() }
  }
}
