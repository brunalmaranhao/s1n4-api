import { ApiTags } from '@nestjs/swagger'
import { BadRequestException, Controller, Get, HttpCode } from '@nestjs/common'
import { Roles } from '@/infra/auth/roles.decorator'
import { FetchBudgetsExpenseBalanceUseCase } from '@/domain/project/application/use-cases/fetch-budget-expense-balance'

@ApiTags('budget-expense')
@Controller('/budget-expense/balance')
export class FetchBudgetExpenseBalanceController {
  constructor(
    private fetchBudgetsExpenseBalanceUseCase: FetchBudgetsExpenseBalanceUseCase,
  ) {}

  @Get()
  @HttpCode(200)
  @Roles([
    'INTERNAL_MANAGEMENT',
    'INTERNAL_PARTNERS',
    'INTERNAL_FINANCIAL_LEGAL',
  ])
  async handle() {
    const result = await this.fetchBudgetsExpenseBalanceUseCase.execute({})

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const data = result.value

    return { data }
  }
}
