import { Either, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { Project } from '../../enterprise/entities/project'
import { ProjectRepository } from '../repositories/project-repository'

interface FetchRecentProjectsUseCaseRequest {
  page: number
  size?: number
}

type FetchRecentProjectsUseCaseResponse = Either<
  null,
  {
    projects: Project[]
  }
>

@Injectable()
export class FetchRecentProjectsUseCase {
  constructor(private projectRepository: ProjectRepository) {}

  async execute({
    page,
    size,
  }: FetchRecentProjectsUseCaseRequest): Promise<FetchRecentProjectsUseCaseResponse> {
    const projects = await this.projectRepository.findAll({ page, size })

    return right({
      projects,
    })
  }
}
