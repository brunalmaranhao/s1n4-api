import { ApiTags } from '@nestjs/swagger'
import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  Param,
} from '@nestjs/common'
import { Roles } from '@/infra/auth/roles.decorator'
import { BudgetExpensePresenter } from '../../presenter/budget-expense'
import { FetchBudgetsExpenseByProjectUseCase } from '@/domain/project/application/use-cases/fetch-budgets-by-project'

@ApiTags('budget-expense')
@Controller('/budget-expense/project/:projectId')
export class FetchBudgetExpenseByProjectController {
  constructor(
    private fetchBudgetsExpenseByProjectUseCase: FetchBudgetsExpenseByProjectUseCase,
  ) {}

  @Get()
  @HttpCode(200)
  @Roles([
    'INTERNAL_MANAGEMENT',
    'INTERNAL_PARTNERS',
    'INTERNAL_FINANCIAL_LEGAL',
  ])
  async handle(@Param('projectId') projectId: string) {
    const result = await this.fetchBudgetsExpenseByProjectUseCase.execute({
      projectId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const budgetExpenses = result.value.budgetExpenses

    const response = budgetExpenses.map(BudgetExpensePresenter.toHTTP)

    return { data: response }
  }
}
