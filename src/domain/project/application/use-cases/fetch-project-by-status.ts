import { Either, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { StatusProject } from '@prisma/client'
import { Project } from '../../enterprise/entities/project'
import { ProjectRepository } from '../repositories/project-repository'

interface FetchProjectByStatusUseCaseRequest {
  page: number
  statusProject: StatusProject
}

type FetchProjectByStatusUseCaseResponse = Either<
  null,
  {
    projects: Project[]
  }
>

@Injectable()
export class FetchProjectByStatusUseCase {
  constructor(private projectRepository: ProjectRepository) {}

  async execute({
    statusProject,
    page,
  }: FetchProjectByStatusUseCaseRequest): Promise<FetchProjectByStatusUseCaseResponse> {
    const projects = await this.projectRepository.fetchByStatus(statusProject, {
      page,
    })

    return right({
      projects,
    })
  }
}
