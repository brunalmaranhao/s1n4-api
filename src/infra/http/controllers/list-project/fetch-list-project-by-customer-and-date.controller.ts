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
import { ListProjectPresenter } from '../../presenter/list-project-presenter'
import { Roles } from '@/infra/auth/roles.decorator'
import { FetchListProjectsByCustomerAndDateUseCase } from '@/domain/project/application/use-cases/fetch-list-projects-by-customer-and-date'

@ApiTags('list-project')
@Controller(
  '/list-project/customer/:customerId/startDate/:startDate/endDate/:endDate',
)
export class FetchListProjectsByCustomerAndDateController {
  constructor(
    private fetchListProjectsByCustomerAndDateUseCase: FetchListProjectsByCustomerAndDateUseCase,
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
    @Param('startDate') startDate: string,
    @Param('endDate') endDate: string,
  ) {
    const result = await this.fetchListProjectsByCustomerAndDateUseCase.execute(
      {
        customerId,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
      },
    )

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
