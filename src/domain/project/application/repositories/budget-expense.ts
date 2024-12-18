import { PaginationParams } from '@/core/repositories/pagination-params'
import { BudgetExpense } from '../../enterprise/entities/budgetExpense'
import { UpdateBudgetExpenseProps } from '@/core/types/budget-expense-props'

export abstract class BudgetExpenseRepository {
  abstract create(budgetExpense: BudgetExpense): Promise<BudgetExpense>
  abstract findById(budgetExpenseId: string): Promise<BudgetExpense | null>
  abstract findAll({ page, size }: PaginationParams): Promise<{
    budgetExpenses: BudgetExpense[]
    total: number
  }>

  abstract findAllWithoutPagination(): Promise<{
    budgetExpenses: BudgetExpense[]
    total: number
  }>

  abstract fetchByProjectId(projectId: string): Promise<BudgetExpense[]>
  abstract fetchByCustomerId(customerId: string): Promise<BudgetExpense[]>
  abstract update(
    budgetExpenseId: string,
    payload: UpdateBudgetExpenseProps,
  ): Promise<BudgetExpense>

  abstract remove(id: string): Promise<void>
}
