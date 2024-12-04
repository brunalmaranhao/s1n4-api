import { Either, left, right } from '@/core/either'
import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { BudgetExpenseRepository } from '../repositories/budget-expense'
import { BudgetExpense } from '../../enterprise/entities/BudgetExpense'

interface FecthBudgetsExpenseUseCaseRequest {
  page: number
  size: number
}

type FecthBudgetsExpenseUseCaseResponse = Either<
  InternalServerErrorException,
  {
    budgetExpenses: BudgetExpense[]
    total: number
  }
>

@Injectable()
export class FetchBudgetsExpenseUseCase {
  constructor(private budgetExpenseRepository: BudgetExpenseRepository) {}

  async execute({
    page,
    size,
  }: FecthBudgetsExpenseUseCaseRequest): Promise<FecthBudgetsExpenseUseCaseResponse> {
    try {
      const response = await this.budgetExpenseRepository.findAll({
        page,
        size,
      })

      return right({
        budgetExpenses: response.budgetExpenses,
        total: response.total,
      })
    } catch (error) {
      return left(new InternalServerErrorException())
    }
  }
}
