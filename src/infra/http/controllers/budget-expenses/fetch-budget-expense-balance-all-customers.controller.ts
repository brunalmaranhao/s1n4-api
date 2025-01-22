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
import { FetchCostumersByStatusWithoutPaginationUseCase } from '@/domain/project/application/use-cases/fetch-costumers-by-status-without-pagination'
import { FetchBudgetsExpenseUseCase } from '@/domain/project/application/use-cases/fetch-budgets-expense'
import { BudgetExpense } from '@/domain/project/enterprise/entities/budgetExpense'

type BalanceAllCustomers = {
  budget: number
  totalBudgetExpense: number
  amountBudgetExpense: number
  balance: number
  customer: string
}

type LastBudgetExpenseProps = {
  project: string
  customer: string
  value: number
  title: string
  date: Date
}

@ApiTags('budget-expense')
@Controller('/budget-expense/balance/all-customers')
export class FetchBudgetExpenseBalanceAllCustomersController {
  constructor(
    private fetchBudgetsExpenseUseCase: FetchBudgetsExpenseUseCase,
    private fetchCostumersByStatusWithoutPaginationUseCase: FetchCostumersByStatusWithoutPaginationUseCase,
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
    const response =
      await this.fetchCostumersByStatusWithoutPaginationUseCase.execute({
        status: 'ACTIVE',
      })
    const dataBalanceAllCustomers: BalanceAllCustomers[] = []
    const dataLastBudgetExpenses: LastBudgetExpenseProps[] = []
    if (response.isRight()) {
      const { customers } = response.value

      for (const customer of customers) {
        const result = await this.fetchBudgetsExpenseBalanceUseCase.execute({
          customerId: customer.id.toString(),
        })

        if (result.isLeft()) {
          throw new BadRequestException()
        }
        const { amountBudgetExpense, balance, budget, totalBudgetExpense } =
          result.value
        dataBalanceAllCustomers.push({
          amountBudgetExpense,
          balance,
          budget,
          totalBudgetExpense,
          customer: customer.name,
        })
      }

      const responseBudgetExpenses =
        await this.fetchBudgetsExpenseUseCase.execute({
          page: 1,
          size: 5,
        })

      if (responseBudgetExpenses.isRight()) {
        const { budgetExpenses } = responseBudgetExpenses.value
        for (const budgetExpense of budgetExpenses) {
          dataLastBudgetExpenses.push({
            title: budgetExpense.title,
            customer: budgetExpense.project?.customer.name || '',
            project: budgetExpense.project?.name || '',
            date: budgetExpense.createdAt,
            value: budgetExpense.amount,
          })
        }
      }

      return { dataLastBudgetExpenses, dataBalanceAllCustomers }
    }
  }
}
