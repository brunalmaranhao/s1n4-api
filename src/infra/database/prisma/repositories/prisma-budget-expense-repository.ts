import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { BudgetExpenseRepository } from '@/domain/project/application/repositories/budget-expense'
import { BudgetExpense } from '@/domain/project/enterprise/entities/budgetExpense'
import { PrismaBudgetExpenseMapper } from '../mappers/prisma-budget-expense-mapper'

@Injectable()
export class PrismaBudgetExpenseRepository implements BudgetExpenseRepository {
  constructor(private prisma: PrismaService) {}

  async findAll({ page, size }: PaginationParams): Promise<{
    budgetExpenses: BudgetExpense[]
    total: number
  }> {
    const amount = size || 20
    const [budgetExpenses, total] = await this.prisma.$transaction([
      this.prisma.budgetExpense.findMany({
        include: {
          project: {
            include: {
              customer: true,
            },
          },
        },
        take: amount,
        skip: (page - 1) * amount,
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.budgetExpense.count(),
    ])

    return {
      budgetExpenses: budgetExpenses.map(
        PrismaBudgetExpenseMapper.toDomainWithProjectAndCustomer,
      ),
      total,
    }
  }

  async findAllWithoutPagination(): Promise<{
    budgetExpenses: BudgetExpense[]
    total: number
  }> {
    const [budgetExpenses, total] = await this.prisma.$transaction([
      this.prisma.budgetExpense.findMany({
        include: {
          project: {
            include: {
              customer: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.budgetExpense.count(),
    ])

    return {
      budgetExpenses: budgetExpenses.map(
        PrismaBudgetExpenseMapper.toDomainWithProjectAndCustomer,
      ),
      total,
    }
  }

  async findById(id: string): Promise<BudgetExpense | null> {
    const expense = await this.prisma.budgetExpense.findUnique({
      where: {
        id,
      },
    })

    if (!expense) {
      return null
    }

    return PrismaBudgetExpenseMapper.toDomain(expense)
  }

  async fetchByProjectId(projectId: string): Promise<BudgetExpense[]> {
    const expense = await this.prisma.budgetExpense.findMany({
      where: {
        projectId,
      },
      include: {
        project: {
          include: {
            customer: true,
          },
        },
      },
    })

    return expense.map(PrismaBudgetExpenseMapper.toDomainWithProjectAndCustomer)
  }

  async fetchByCustomerId(customerId: string): Promise<BudgetExpense[]> {
    const expense = await this.prisma.budgetExpense.findMany({
      where: {
        project: {
          customerId,
        },
      },
      include: {
        project: {
          include: {
            customer: true,
          },
        },
      },
    })

    return expense.map(PrismaBudgetExpenseMapper.toDomainWithProjectAndCustomer)
  }

  async create(budgetExpense: BudgetExpense): Promise<BudgetExpense> {
    const data = PrismaBudgetExpenseMapper.toPrisma(budgetExpense)

    const newExpense = await this.prisma.budgetExpense.create({
      data,
    })
    return PrismaBudgetExpenseMapper.toDomain(newExpense)
  }
}
