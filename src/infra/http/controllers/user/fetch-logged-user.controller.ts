import { ApiTags } from '@nestjs/swagger'
import { BadRequestException, Controller, Get, HttpCode } from '@nestjs/common'
import { Roles } from '@/infra/auth/roles.decorator'
import { UserNotFoundError } from '@/domain/project/application/use-cases/errors/user-not-found-error'
import { FetchUserByIdUseCase } from '@/domain/project/application/use-cases/fetch-user-by-id'
import { UserPresenter } from '../../presenter/user-presenter'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { CurrentUser } from '@/infra/auth/currrent-user.decorator'

@ApiTags('user')
@Controller('/user')
export class FetchLoggedUserController {
  constructor(private fetchUserUseCase: FetchUserByIdUseCase) {}

  @Get()
  @HttpCode(200)
  @Roles([
    'INTERNAL_MANAGEMENT',
    'INTERNAL_PARTNERS',
    'INTERNAL_FINANCIAL_LEGAL',
    'CLIENT_USER',
    'CLIENT_OWNER',
    'CLIENT_RESPONSIBLE',
  ])
  async handle(@CurrentUser() user: UserPayload) {
    const result = await this.fetchUserUseCase.execute({
      id: user.sub,
    })

    if (result.isLeft()) {
      const error = result.value
      switch (error.constructor) {
        case UserNotFoundError:
          throw new BadRequestException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    return { user: UserPresenter.toHTTP(result.value.user) }
  }
}
