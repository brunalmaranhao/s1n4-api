import { Either, left, right } from '@/core/either'
import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { BudgetExpenseRepository } from '../repositories/budget-expense'
import { BudgetExpense } from '../../enterprise/entities/budgetExpense'
import { CustomerRepository } from '../repositories/customer-repository'
import { Customer } from '../../enterprise/entities/customer'
import { CustomerNotFoundError } from './errors/customer-not-found'

interface FecthBudgetsExpenseByCustomerUseCaseRequest {
  customerId: string
}

type FecthBudgetsExpenseByCustomerUseCaseResponse = Either<
  InternalServerErrorException | CustomerNotFoundError,
  {
    budgetExpenses: BudgetExpense[]
    customer: Customer
  }
>

@Injectable()
export class FetchBudgetsExpenseByCustomerUseCase {
  constructor(
    private budgetExpenseRepository: BudgetExpenseRepository,
    private customerRepository: CustomerRepository,
  ) {}

  async execute({
    customerId,
  }: FecthBudgetsExpenseByCustomerUseCaseRequest): Promise<FecthBudgetsExpenseByCustomerUseCaseResponse> {
    try {
      const customer = await this.customerRepository.findById(customerId)
      if (!customer) return left(new CustomerNotFoundError())

      const response =
        await this.budgetExpenseRepository.fetchByCustomerId(customerId)

      return right({
        budgetExpenses: response,
        customer,
      })
    } catch (error) {
      return left(new InternalServerErrorException())
    }
  }
}
