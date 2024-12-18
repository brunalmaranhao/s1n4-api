import { BudgetExpense } from '@/domain/project/enterprise/entities/budgetExpense'

export class BudgetExpensePresenter {
  static toHTTP(budgetExpense: BudgetExpense) {
    return {
      id: budgetExpense.id.toString(),
      title: budgetExpense.title,
      description: budgetExpense.description,
      createdAt: budgetExpense.createdAt,
      amount: budgetExpense.amount,
      project: {
        id: budgetExpense.project?.id.toString(),
        name: budgetExpense.project?.name,
        budget: budgetExpense.project?.budget,
      },
      customer: {
        id: budgetExpense.project?.customer.id,
        name: budgetExpense.project?.customer.name,
      },
      status: budgetExpense.status,
    }
  }
}
