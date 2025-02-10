import { Either, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { StatusProject } from '@prisma/client'
import { Project } from '../../enterprise/entities/project'
import { ProjectRepository } from '../repositories/project-repository'

interface FetchProjectByStatusUseCaseRequest {
  status: StatusProject
}

type FetchProjectByStatusUseCaseResponse = Either<
  null,
  {
    projects: Project[]
    total: number
  }
>

@Injectable()
export class FetchProjectByStatusUseCase {
  constructor(private projectRepository: ProjectRepository) {}

  async execute({
    status,
  }: FetchProjectByStatusUseCaseRequest): Promise<FetchProjectByStatusUseCaseResponse> {
    const response = await this.projectRepository.findByStatus(status)
    // console.log(response)

    return right({
      projects: response.projects,
      total: response.total,
    })
  }
}
