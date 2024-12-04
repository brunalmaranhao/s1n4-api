import { faker } from '@faker-js/faker'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import {
  BudgetExpense,
  BudgetExpenseProps,
} from '@/domain/project/enterprise/entities/budgetExpense'
import { PrismaBudgetExpenseMapper } from '@/infra/database/prisma/mappers/prisma-budget-expense-mapper'

export function makeBudgetExpense(
  override: Partial<BudgetExpenseProps> = {},
  id?: UniqueEntityID,
) {
  const budgetExpense = BudgetExpense.create(
    {
      title: faker.finance.transactionDescription(),
      amount: 100,
      projectId: new UniqueEntityID('1'),
      ...override,
    },
    id,
  )

  return budgetExpense
}

@Injectable()
export class BudgetExpenseFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaBudgetExpense(
    data: Partial<BudgetExpenseProps> = {},
  ): Promise<BudgetExpense> {
    const budgetExpense = makeBudgetExpense(data)

    await this.prisma.budgetExpense.create({
      data: PrismaBudgetExpenseMapper.toPrisma(budgetExpense),
    })

    return budgetExpense
  }
}
