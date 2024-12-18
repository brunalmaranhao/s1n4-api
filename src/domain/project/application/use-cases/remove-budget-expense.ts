import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { CustomerNotFoundError } from './errors/customer-not-found'
import { CustomerRepository } from '../repositories/customer-repository'
import { BudgetExpenseNotFound } from './errors/budget-expense-not-found'
import { BudgetExpenseRepository } from '../repositories/budget-expense'

interface RemoveBudgetExpenseUseCaseRequest {
  id: string
}

type RemoveBudgetExpenseUseCaseResponse = Either<BudgetExpenseNotFound, null>

@Injectable()
export class RemoveBudgetExpenseUseCase {
  constructor(private budgetExpenseRepository: BudgetExpenseRepository) {}

  async execute({
    id,
  }: RemoveBudgetExpenseUseCaseRequest): Promise<RemoveBudgetExpenseUseCaseResponse> {
    const expense = await this.budgetExpenseRepository.findById(id)

    if (!expense) {
      return left(new BudgetExpenseNotFound())
    }

    await this.budgetExpenseRepository.remove(id)

    return right(null)
  }
}
