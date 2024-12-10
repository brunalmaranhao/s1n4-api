import { ApiTags } from '@nestjs/swagger'
import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  NotFoundException,
  Param,
} from '@nestjs/common'
import { CustomerNotFoundError } from '@/domain/project/application/use-cases/errors/customer-not-found'
import { CurrentUser } from '@/infra/auth/currrent-user.decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { FetchListProjectsByCustomerUseCase } from '@/domain/project/application/use-cases/fetch-list-projects-by-customer'
import { ListProjectPresenter } from '../../presenter/list-project-presenter'
import { Roles } from '@/infra/auth/roles.decorator'

@ApiTags('list-project')
@Controller('/list-project/customer/:customerId')
export class FetchListProjectByCustomerController {
  constructor(
    private fetchListProjectsByCustomerUseCase: FetchListProjectsByCustomerUseCase,
  ) {}

  @Get()
  @HttpCode(200)
  @Roles([
    'INTERNAL_MANAGEMENT',
    'INTERNAL_PARTNERS',
    'INTERNAL_FINANCIAL_LEGAL',
  ])
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('customerId') customerId: string,
  ) {
    const result = await this.fetchListProjectsByCustomerUseCase.execute({
      customerId,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case CustomerNotFoundError:
          throw new NotFoundException('Cliente não encontrado.')
        default:
          throw new BadRequestException()
      }
    }

    const listProjects = result.value.listProjects

    return { listProjects: listProjects.map(ListProjectPresenter.toHTTP) }
  }
}
