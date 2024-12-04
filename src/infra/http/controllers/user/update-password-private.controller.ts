import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  InternalServerErrorException,
  Put,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { z } from 'zod'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { Public } from '@/infra/auth/public'
import { UpdatePasswordUseCase } from '@/domain/project/application/use-cases/update-password'
import { UpdatePasswordDto } from './dto/update-password-dto'
import { UpdatePasswordError } from '@/domain/project/application/use-cases/errors/update-password-error'
import { CurrentUser } from '@/infra/auth/currrent-user.decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'

const updatePasswordBodySchema = z.object({
  password: z.string(),
})
const bodyValidationPipe = new ZodValidationPipe(updatePasswordBodySchema)

@ApiTags('/user')
@Controller('/user/update-password-private')
export class UpdatePasswordPrivateController {
  constructor(private updatePassowordUseCase: UpdatePasswordUseCase) {}

  @Put()
  @HttpCode(201)
  async handle(
    @Body(bodyValidationPipe) body: UpdatePasswordDto,
    @CurrentUser() user: UserPayload,
  ) {
    const { password } = body

    const resultUpdate = await this.updatePassowordUseCase.execute({
      userId: user.sub,
      password,
    })
    if (resultUpdate.isLeft()) {
      const error = resultUpdate.value

      switch (error.constructor) {
        case UpdatePasswordError:
          throw new InternalServerErrorException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
