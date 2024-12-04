import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  ConflictException,
  Delete,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { ApiTags } from '@nestjs/swagger'
import { Roles } from '@/infra/auth/roles.decorator'
import { RemoveUserUseCase } from '@/domain/project/application/use-cases/remove-user'
import { RemoveUserDto } from './dto/remove-user-dto'
import { UserNotFoundError } from '@/domain/project/application/use-cases/errors/user-not-found-error'

const removeUserBodySchema = z.object({
  id: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(removeUserBodySchema)

@ApiTags('user')
@Controller('/user')
export class RemoveUserController {
  constructor(private removeUserUseCase: RemoveUserUseCase) {}

  @Delete()
  @HttpCode(204)
  @Roles([
    'INTERNAL_MANAGEMENT',
    'INTERNAL_PARTNERS',
    'INTERNAL_FINANCIAL_LEGAL',
  ])
  async handle(@Body(bodyValidationPipe) body: RemoveUserDto) {
    const { id } = body

    const result = await this.removeUserUseCase.execute({
      id,
    })

    if (result.isLeft()) {
      const error = result.value
      switch (error.constructor) {
        case UserNotFoundError:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
