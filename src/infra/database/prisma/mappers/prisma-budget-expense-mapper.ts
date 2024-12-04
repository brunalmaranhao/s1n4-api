import { BudgetExpense as PrismaBudgetExpense, Prisma } from '@prisma/client'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  BudgetExpense,
  ProjectWithCustomerProps,
} from '../../../../domain/project/enterprise/entities/budgetExpense'

type BudgetExpenseProps = PrismaBudgetExpense & {
  project: ProjectWithCustomerProps
}

export class PrismaBudgetExpenseMapper {
  static toDomainWithProjectAndCustomer(
    raw: BudgetExpenseProps,
  ): BudgetExpense {
    return BudgetExpense.create(
      {
        title: raw.title,
        description: raw.description,
        amount: raw.amount,
        projectId: new UniqueEntityID(raw.projectId),
        createdAt: raw.createdAt,
        project: raw.project,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toDomain(raw: PrismaBudgetExpense): BudgetExpense {
    return BudgetExpense.create(
      {
        title: raw.title,
        description: raw.description,
        amount: raw.amount,
        projectId: new UniqueEntityID(raw.projectId),
        createdAt: raw.createdAt,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(
    expense: BudgetExpense,
  ): Prisma.BudgetExpenseUncheckedCreateInput {
    return {
      id: expense.id.toString(),
      title: expense.title,
      description: expense.description,
      amount: expense.amount,
      projectId: expense.projectId.toString(),
      createdAt: expense.createdAt,
    }
  }
}
