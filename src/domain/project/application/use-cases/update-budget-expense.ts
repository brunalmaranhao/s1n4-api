import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { UpdateBudgetExpenseProps } from '@/core/types/budget-expense-props'
import { BudgetExpenseRepository } from '../repositories/budget-expense'
import { BudgetExpenseNotFound } from './errors/budget-expense-not-found'
import { BudgetExpense } from '../../enterprise/entities/budgetExpense'

interface UpdateBudgetExpenseUseCaseRequest {
  id: string
  payload: UpdateBudgetExpenseProps
}

type UpdateBudgetExpenseUseCaseResponse = Either<
  BudgetExpenseNotFound,
  {
    budgetExpense: BudgetExpense
  }
>

@Injectable()
export class UpdateBudgetExpenseUseCase {
  constructor(private budgetExpenseRepository: BudgetExpenseRepository) {}

  async execute({
    id,
    payload,
  }: UpdateBudgetExpenseUseCaseRequest): Promise<UpdateBudgetExpenseUseCaseResponse> {
    const expense = await this.budgetExpenseRepository.findById(id)

    if (!expense) {
      return left(new BudgetExpenseNotFound())
    }

    const updatedBudgetExpense = await this.budgetExpenseRepository.update(
      id,
      payload,
    )

    return right({
      budgetExpense: updatedBudgetExpense,
    })
  }
}
