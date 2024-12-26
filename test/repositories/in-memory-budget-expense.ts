import { DomainEvents } from '@/core/events/domain-events'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { UpdateBudgetExpenseProps } from '@/core/types/budget-expense-props'
import { BudgetExpenseRepository } from '@/domain/project/application/repositories/budget-expense'
import { BudgetExpense } from '@/domain/project/enterprise/entities/b udgetExpense'
import { BudgetExpense } from '@/domain/project/enterprise/entities/budgetExpense'
import { Status } from '@prisma/client'

export class InMemoryBudgetExpenseRepository
  implements BudgetExpenseRepository
{
  public items: BudgetExpense[] = []

  async create(budgetExpense: BudgetExpense): Promise<BudgetExpense> {
    this.items.push(budgetExpense)

    DomainEvents.dispatchEventsForAggregate(budgetExpense.id)
    return budgetExpense
  }

  async findById(budgetExpenseId: string): Promise<BudgetExpense | null> {
    const budgetExpense = this.items.find(
      (item) => item.id.toString() === budgetExpenseId,
    )

    if (!budgetExpense) {
      return null
    }

    return budgetExpense
  }

  async findAll({ page }: PaginationParams): Promise<{
    budgetExpenses: BudgetExpense[]
    total: number
  }> {
    const budgetExpenses = this.items.slice((page - 1) * 20, page * 20)

    return { budgetExpenses, total: budgetExpenses.length }
  }

  async findAllWithoutPagination(): Promise<{
    budgetExpenses: BudgetExpense[]
    total: number
  }> {
    const budgetExpenses = this.items

    return { budgetExpenses, total: budgetExpenses.length }
  }

  async fetchByProjectId(projectId: string): Promise<BudgetExpense[]> {
    const budgetExpenses = this.items.filter(
      (item) => item.projectId.toString() === projectId,
    )

    return budgetExpenses
  }

  async fetchByCustomerId(customerId: string): Promise<BudgetExpense[]> {
    const budgetExpenses = this.items.filter(
      (item) => item.project?.customer.id.toString() === customerId,
    )

    return budgetExpenses
  }
}
