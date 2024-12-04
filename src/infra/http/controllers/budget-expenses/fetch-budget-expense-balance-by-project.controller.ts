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
@Controller('/budget-expense/balance/project/:projectId')
export class FetchBudgetExpenseBalanceByProjectController {
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
  async handle(@Param('projectId') projectId: string) {
    const result = await this.fetchBudgetsExpenseBalanceUseCase.execute({
      projectId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const data = result.value

    return { data }
  }
}
