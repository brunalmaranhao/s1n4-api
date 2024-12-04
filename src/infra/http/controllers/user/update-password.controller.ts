import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  ForbiddenException,
  UnprocessableEntityException,
  InternalServerErrorException,
  Put,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { z } from 'zod'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { Public } from '@/infra/auth/public'
import { UserNotFoundError } from '@/domain/project/application/use-cases/errors/user-not-found-error'
import { VerifyAccountUseCase } from '@/domain/project/application/use-cases/verify-account'
import { UpdatePasswordUseCase } from '@/domain/project/application/use-cases/update-password'
import { UpdatePasswordDto } from './dto/update-password-dto'
import { TokenNotValidFoundError } from '@/domain/project/application/use-cases/errors/token-not-valid-error'
import { UpdatePasswordError } from '@/domain/project/application/use-cases/errors/update-password-error'

const updatePasswordBodySchema = z.object({
  token: z.string(),
  email: z.string(),
  password: z.string(),
})
const bodyValidationPipe = new ZodValidationPipe(updatePasswordBodySchema)

@ApiTags('/user')
@Controller('/user/update-password')
@Public()
export class UpdatePasswordController {
  constructor(
    private verifyAccountUseCase: VerifyAccountUseCase,
    private updatePassowordUseCase: UpdatePasswordUseCase,
  ) {}

  @Put()
  @HttpCode(201)
  async handle(@Body(bodyValidationPipe) body: UpdatePasswordDto) {
    const { token, email, password } = body
    const result = await this.verifyAccountUseCase.execute({ email, token })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case TokenNotValidFoundError:
          throw new ForbiddenException(error.message)
        case UserNotFoundError:
          throw new UnprocessableEntityException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
    const { user } = result.value

    const resultUpdate = await this.updatePassowordUseCase.execute({
      userId: user.id.toString(),
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
