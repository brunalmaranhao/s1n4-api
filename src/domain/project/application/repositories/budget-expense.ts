import { PaginationParams } from '@/core/repositories/pagination-params'
import { BudgetExpense } from '../../enterprise/entities/budgetExpense'

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
}
