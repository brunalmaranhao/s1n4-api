import { ApiTags } from '@nestjs/swagger'
import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  Param,
} from '@nestjs/common'
import { Roles } from '@/infra/auth/roles.decorator'
import { FetchBudgetsExpenseBalanceUseCase } from '@/domain/project/application/use-cases/fetch-budget-expense-balance'

@ApiTags('budget-expense')
@Controller('/budget-expense/balance/customer/:customerId')
export class FetchBudgetExpenseBalanceByCustomerController {
  constructor(
    private fetchBudgetsExpenseBalanceUseCase: FetchBudgetsExpenseBalanceUseCase,
  ) {}

  @Get()
  @HttpCode(200)
  @Roles([
    'INTERNAL_MANAGEMENT',
    'INTERNAL_PARTNERS',
    'INTERNAL_FINANCIAL_LEGAL',
    'CLIENT_RESPONSIBLE',
    'CLIENT_OWNER',
    'CLIENT_USER',
  ])
  async handle(@Param('customerId') customerId: string) {
    const result = await this.fetchBudgetsExpenseBalanceUseCase.execute({
      customerId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const data = result.value

    return { data }
  }
}
