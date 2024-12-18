import { ApiTags } from '@nestjs/swagger'
import { Controller, Get, HttpCode, Param } from '@nestjs/common'
import { CurrentUser } from '@/infra/auth/currrent-user.decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { Roles } from '@/infra/auth/roles.decorator'
import { FetchProjectByStatusAndCustomerUseCase } from '@/domain/project/application/use-cases/fetch-project-by-status-and-customer'
import { ProjectPresenter } from '../../presenter/project-presenter'

@ApiTags('project')
@Controller('/projects/:customer/statistics')
export class FetchStatisticsProjectsCustomerController {
  constructor(
    private fetchProjectByStatusAndCustomerUseCase: FetchProjectByStatusAndCustomerUseCase,
  ) {}

  @Roles([
    'INTERNAL_MANAGEMENT',
    'INTERNAL_PARTNERS',
    'INTERNAL_FINANCIAL_LEGAL',
  ])
  @Get()
  @HttpCode(200)
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('customer') customer: string,
  ) {
    const resultDone =
      await this.fetchProjectByStatusAndCustomerUseCase.execute({
        status: 'DONE',
        customerId: customer,
      })

    const resultInProgress =
      await this.fetchProjectByStatusAndCustomerUseCase.execute({
        status: 'ACTIVE',
        customerId: customer,
      })

    return {
      projectsDone: resultDone.value?.projects.map(ProjectPresenter.toHTTP),
      projectInProgress: resultInProgress.value?.projects.map(
        ProjectPresenter.toHTTP,
      ),
      total: resultDone.value?.total,
    }
  }
}
