import { ApiTags } from '@nestjs/swagger'
import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  Param,
} from '@nestjs/common'
import { Roles } from '@/infra/auth/roles.decorator'
import { CustomerPresenterAllFields } from '../../presenter/customer-presenter-all-fields'
import { ResponsiblePartiesNotFoundError } from '@/domain/project/application/use-cases/errors/responsible-not-found-error'
import { ResponsiblePartiesPresenter } from '../../presenter/responsible-parties'
import { FetchResponsiblePartiesByIdUseCase } from '@/domain/project/application/use-cases/fetch-responsible-parties-by-id'
import { UserNotFoundError } from '@/domain/project/application/use-cases/errors/user-not-found-error'
import { FetchUserByIdUseCase } from '@/domain/project/application/use-cases/fetch-user-by-id'
import { UserPresenter } from '../../presenter/user-presenter'

@ApiTags('user')
@Controller('/user/id/:id')
export class FetchUserByIdController {
  constructor(private fetchUserByIdUseCase: FetchUserByIdUseCase) {}

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
  async handle(@Param('id') id: string) {
    const result = await this.fetchUserByIdUseCase.execute({
      id,
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

    const user = UserPresenter.toHTTP(result.value.user)

    return { user }
  }
}
