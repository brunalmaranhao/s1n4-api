import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import {
  Customer as PrismaCustomer,
  Project as PrismaProject,
} from '@prisma/client'
import { Customer } from './customer'

export type ProjectWithCustomerProps = PrismaProject & {
  customer: PrismaCustomer | Customer
}

export interface BudgetExpenseProps {
  title: string
  description?: string | null
  amount: number
  projectId: UniqueEntityID
  createdAt: Date
  project?: ProjectWithCustomerProps
}

export class BudgetExpense extends Entity<BudgetExpenseProps> {
  get project() {
    return this.props.project
  }

  get title() {
    return this.props.title
  }

  get description() {
    return this.props.description
  }

  get amount() {
    return this.props.amount
  }

  get projectId() {
    return this.props.projectId
  }

  get createdAt() {
    return this.props.createdAt
  }

  static create(
    props: Optional<BudgetExpenseProps, 'createdAt'>,
    id?: UniqueEntityID,
  ) {
    const budgetExpense = new BudgetExpense(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )

    return budgetExpense
  }
}
