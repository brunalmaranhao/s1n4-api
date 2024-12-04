import { Either, left, right } from '@/core/either'
import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { BudgetExpenseRepository } from '../repositories/budget-expense'
import { BudgetExpense } from '../../enterprise/entities/budgetExpense'
import { ProjectRepository } from '../repositories/project-repository'
import { ProjectNotFoundError } from './errors/project-not-found-error'
import { Project } from '../../enterprise/entities/project'

interface FecthBudgetsExpenseByProjectUseCaseRequest {
  projectId: string
}

type FecthBudgetsExpenseByProjectUseCaseResponse = Either<
  InternalServerErrorException | ProjectNotFoundError,
  {
    budgetExpenses: BudgetExpense[]
    project: Project
  }
>

@Injectable()
export class FetchBudgetsExpenseByProjectUseCase {
  constructor(
    private budgetExpenseRepository: BudgetExpenseRepository,
    private projectRepository: ProjectRepository,
  ) {}

  async execute({
    projectId,
  }: FecthBudgetsExpenseByProjectUseCaseRequest): Promise<FecthBudgetsExpenseByProjectUseCaseResponse> {
    try {
      const project = await this.projectRepository.findById(projectId)
      if (!project) return left(new ProjectNotFoundError())

      const response =
        await this.budgetExpenseRepository.fetchByProjectId(projectId)

      return right({
        budgetExpenses: response,
        project,
      })
    } catch (error) {
      return left(new InternalServerErrorException())
    }
  }
}
