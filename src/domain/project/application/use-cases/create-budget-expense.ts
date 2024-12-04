import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { BudgetExpense } from '../../enterprise/entities/BudgetExpense'
import { BudgetExpenseRepository } from '../repositories/budget-expense'
import { ProjectRepository } from '../repositories/project-repository'
import { ProjectNotFoundError } from './errors/project-not-found-error'
import { LaunchBudgetExpenseError } from './errors/launch-budget-expense-error'

interface CreateBudgetExpenseUseCaseRequest {
  title: string
  description?: string
  amount: number
  projectId: string
}

type CreateBudgetExpenseUseCaseResponse = Either<
  ProjectNotFoundError | LaunchBudgetExpenseError,
  {
    budgetExpense: BudgetExpense
  }
>

@Injectable()
export class CreateBudgetExpenseUseCase {
  constructor(
    private budgetExpenseRepository: BudgetExpenseRepository,
    private projectRepository: ProjectRepository,
  ) {}

  async execute({
    title,
    description,
    amount,
    projectId,
  }: CreateBudgetExpenseUseCaseRequest): Promise<CreateBudgetExpenseUseCaseResponse> {
    const project = await this.projectRepository.findById(projectId)
    if (!project) return left(new ProjectNotFoundError())

    const budgetExpensesByProject =
      await this.budgetExpenseRepository.fetchByProjectId(projectId)

    const totalExpenses = budgetExpensesByProject.reduce(
      (sum, expense) => sum + expense.amount,
      0,
    )
    const budget = project.budget ?? 0

    if (totalExpenses + amount > budget) {
      return left(new LaunchBudgetExpenseError())
    }

    const newBudgetExpense = BudgetExpense.create({
      title,
      projectId: new UniqueEntityID(projectId),
      description,
      amount,
    })

    const budgetExpense =
      await this.budgetExpenseRepository.create(newBudgetExpense)

    return right({
      budgetExpense,
    })
  }
}
