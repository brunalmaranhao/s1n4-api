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
import { FetchBudgetsExpenseByCustomerUseCase } from '@/domain/project/application/use-cases/fetch-budgets-by-customer'

@ApiTags('budget-expense')
@Controller('/budget-expense/customer/:customerId')
export class FetchBudgetExpenseByCustomerController {
  constructor(
    private fetchBudgetsExpenseByCustomerUseCase: FetchBudgetsExpenseByCustomerUseCase,
  ) {}

  @Get()
  @HttpCode(200)
  @Roles([
    'INTERNAL_MANAGEMENT',
    'INTERNAL_PARTNERS',
    'INTERNAL_FINANCIAL_LEGAL',
  ])
  async handle(@Param('customerId') customerId: string) {
    const result = await this.fetchBudgetsExpenseByCustomerUseCase.execute({
      customerId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const budgetExpenses = result.value.budgetExpenses

    const response = budgetExpenses.map(BudgetExpensePresenter.toHTTP)

    return { data: response }
  }
}
