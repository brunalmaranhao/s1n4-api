import { ApiQuery, ApiTags } from '@nestjs/swagger'
import { Controller, Get, HttpCode, Query } from '@nestjs/common'
import { ProjectPresenter } from '../../presenter/project-presenter'
import { CurrentUser } from '@/infra/auth/currrent-user.decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { FetchOverdueProjectsUseCase } from '@/domain/project/application/use-cases/fetch-overdue-projects'

@ApiTags('project')
@Controller('/projects/overdue')
export class FetchOverdueProjectsController {
  constructor(
    private fetchOverdueProjectsUseCase: FetchOverdueProjectsUseCase,
  ) {}

  @Get()
  @HttpCode(200)
  @ApiQuery({
    name: 'customerId',
    required: false,
    description: 'ID do cliente para filtrar projetos vencidos',
  })
  async handle(
    @CurrentUser() user: UserPayload,
    @Query('customerId') customerId?: string,
  ) {
    const result = await this.fetchOverdueProjectsUseCase.execute({
      date: new Date(),
      customerId,
    })

    const customerProjects = result.value?.projects
    if (customerProjects) {
      const projects = customerProjects.map(ProjectPresenter.toHTTP)

      return { projects, totalProjects: result.value?.totalProjects }
    }
  }
}
