import { Either, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { Status } from '@prisma/client'
import { Project } from '../../enterprise/entities/project'
import { ProjectRepository } from '../repositories/project-repository'

interface FetchProjectByStatusUseCaseRequest {
  page: number
  status: Status
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
    status,
    page,
  }: FetchProjectByStatusUseCaseRequest): Promise<FetchProjectByStatusUseCaseResponse> {
    const projects = await this.projectRepository.fetchByStatus(status, {
      page,
    })

    return right({
      projects,
    })
  }
}
