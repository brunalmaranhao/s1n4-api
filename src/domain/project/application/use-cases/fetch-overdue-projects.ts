import { Either, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { Project } from '../../enterprise/entities/project'
import { ProjectRepository } from '../repositories/project-repository'

interface FetchProjectByDateAndCustomerUseCaseRequest {
  date: Date
  customerId?: string
}

type FetchProjectByDateAndCustomerUseCaseResponse = Either<
  null,
  {
    projects: Project[]
    totalProjects: number
  }
>

@Injectable()
export class FetchOverdueProjectsUseCase {
  constructor(private projectRepository: ProjectRepository) {}

  async execute({
    date,
    customerId,
  }: FetchProjectByDateAndCustomerUseCaseRequest): Promise<FetchProjectByDateAndCustomerUseCaseResponse> {
    const response = await this.projectRepository.findOverdueProjects(
      date,
      customerId,
    )

    return right({
      projects: response.overdueProjects,
      totalProjects: response.totalActiveProjects,
    })
  }
}
