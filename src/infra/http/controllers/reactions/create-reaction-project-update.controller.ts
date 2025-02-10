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
import { CurrentUser } from '@/infra/auth/currrent-user.decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { EmojiNotFoundError } from '@/domain/project/application/use-cases/errors/emoji-not-found-error'
import { CreateReactionProjectUpdateUseCase } from '@/domain/project/application/use-cases/create-reaction-project-update'
import { CreateReactionProjectUpdateDto } from './dto/create-reaction-project-update-dto'

const createReactionProjectUpdateBodySchema = z.object({
  unified: z.string(),
  projectUpdateId: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(
  createReactionProjectUpdateBodySchema,
)

@ApiTags('reaction')
@Controller('/reaction/project-update')
export class CreateReactionProjectUpdateController {
  constructor(
    private createReactionProjectUpdateUseCase: CreateReactionProjectUpdateUseCase,
  ) {}

  @Post()
  @HttpCode(201)
  async handle(
    @Body(bodyValidationPipe) body: CreateReactionProjectUpdateDto,
    @CurrentUser() user: UserPayload,
  ) {
    const { projectUpdateId, unified } = body

    const result = await this.createReactionProjectUpdateUseCase.execute({
      unified,
      projectUpdateId,
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
