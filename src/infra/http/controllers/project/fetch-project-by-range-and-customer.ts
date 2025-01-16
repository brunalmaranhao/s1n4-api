import { ApiTags } from '@nestjs/swagger'
import { Controller, Get, HttpCode, Param } from '@nestjs/common'
import { Roles } from '@/infra/auth/roles.decorator'
import { ProjectPresenter } from '../../presenter/project-presenter'
import { FetchProjectByDateAndCustomerUseCase } from '@/domain/project/application/use-cases/fetch-projects-by-customer-and-date'

@ApiTags('customer')
@Controller(
  '/projects/customer/:customerId/startDate/:startDate/endDate/:endDate',
)
export class FetchCustomerProjectsController {
  constructor(
    private fetchProjectByDateAndCustomerUseCase: FetchProjectByDateAndCustomerUseCase,
  ) {}

  @Get()
  @HttpCode(200)
  @Roles([
    'INTERNAL_MANAGEMENT',
    'INTERNAL_PARTNERS',
    'INTERNAL_FINANCIAL_LEGAL',
  ])
  async handle(
    @Param('customerId') customerId: string,
    @Param('startDate') startDate: string,
    @Param('endDate') endDate: string,
  ) {
    const result = await this.fetchProjectByDateAndCustomerUseCase.execute({
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      customerId,
    })

    if (result.isRight()) {
      const customerProjects = result.value.projects

      const projects = customerProjects.map(ProjectPresenter.toHTTP)

      return { projects }
    }
  }
}
