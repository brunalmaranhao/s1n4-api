import { Either, left, right } from '@/core/either'
import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { BudgetExpenseRepository } from '../repositories/budget-expense'
import { ProjectRepository } from '../repositories/project-repository'

interface FecthBudgetsExpenseBalanceUseCaseRequest {
  customerId?: string
  projectId?: string
}

type FecthBudgetsExpenseBalanceUseCaseResponse = Either<
  InternalServerErrorException,
  {
    budget: number
    totalBudgetExpense: number
    amountBudgetExpense: number
    balance: number
  }
>

@Injectable()
export class FetchBudgetsExpenseBalanceUseCase {
  constructor(
    private budgetExpenseRepository: BudgetExpenseRepository,
    private projectRepository: ProjectRepository,
  ) {}

  async execute({
    customerId,
    projectId,
  }: FecthBudgetsExpenseBalanceUseCaseRequest): Promise<FecthBudgetsExpenseBalanceUseCaseResponse> {
    try {
      let budget = 0
      let totalBudgetExpense = 0
      let amountBudgetExpense = 0
      let balance = 0

      if (projectId) {
        const project = await this.projectRepository.findById(projectId)
        const responseBudgetExpenses =
          await this.budgetExpenseRepository.fetchByProjectId(projectId)
        if (project?.budget) {
          budget = project.budget
        }
        for (const budgetExpense of responseBudgetExpenses) {
          amountBudgetExpense += budgetExpense.amount
        }
        totalBudgetExpense = responseBudgetExpenses.length
        balance = budget - amountBudgetExpense
      } else if (customerId) {
        const responseProjects =
          await this.projectRepository.fetchCustomerProjects(customerId)
        const responseBudgetExpenses =
          await this.budgetExpenseRepository.fetchByCustomerId(customerId)
        for (const project of responseProjects) {
          if (project.budget) {
            budget += project.budget
          }
        }
        for (const budgetExpense of responseBudgetExpenses) {
          amountBudgetExpense += budgetExpense.amount
        }
        totalBudgetExpense = responseBudgetExpenses.length
        balance = budget - amountBudgetExpense
      } else {
        const responseProjects =
          await this.projectRepository.findAllWithoutPagination()
        const responseBudgetExpenses =
          await this.budgetExpenseRepository.findAllWithoutPagination()
        for (const project of responseProjects.projects) {
          if (project.budget) {
            budget += project.budget
          }
        }
        for (const budgetExpense of responseBudgetExpenses.budgetExpenses) {
          amountBudgetExpense += budgetExpense.amount
        }
        totalBudgetExpense = responseBudgetExpenses.total
        balance = budget - amountBudgetExpense
      }

      return right({
        balance,
        amountBudgetExpense,
        totalBudgetExpense,
        budget,
      })
    } catch (error) {
      return left(new InternalServerErrorException())
    }
  }
}
