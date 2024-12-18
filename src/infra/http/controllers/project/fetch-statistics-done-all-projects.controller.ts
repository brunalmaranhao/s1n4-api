import { ApiTags } from '@nestjs/swagger'
import { Controller, Get, HttpCode } from '@nestjs/common'
import { CurrentUser } from '@/infra/auth/currrent-user.decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { FetchProjectByStatusUseCase } from '@/domain/project/application/use-cases/fetch-project-by-status'
import { Roles } from '@/infra/auth/roles.decorator'
import { ProjectPresenter } from '../../presenter/project-presenter'

@ApiTags('project')
@Controller('/projects/statistics')
export class FetchStatisticsController {
  constructor(
    private fetchProjectByStatusUseCase: FetchProjectByStatusUseCase,
  ) {}

  @Roles([
    'INTERNAL_MANAGEMENT',
    'INTERNAL_PARTNERS',
    'INTERNAL_FINANCIAL_LEGAL',
  ])
  @Get()
  @HttpCode(200)
  async handle(@CurrentUser() user: UserPayload) {
    const resultDone = await this.fetchProjectByStatusUseCase.execute({
      status: 'DONE',
    })

    const resultInProgress = await this.fetchProjectByStatusUseCase.execute({
      status: 'ACTIVE',
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
