import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { ProjectNotFoundError } from './errors/project-not-found-error'
import { Project } from '../../enterprise/entities/project'
import { ProjectRepository } from '../repositories/project-repository'

interface FetchProjectByIdUseCaseRequest {
  id: string
}

type FetchProjectByIdUseCaseResponse = Either<
  ProjectNotFoundError,
  {
    project: Project
  }
>

@Injectable()
export class FetchProjectByIdUseCase {
  constructor(private projectRepository: ProjectRepository) {}

  async execute({
    id,
  }: FetchProjectByIdUseCaseRequest): Promise<FetchProjectByIdUseCaseResponse> {
    const project = await this.projectRepository.findById(id)

    if (!project) {
      return left(new ProjectNotFoundError())
    }

    return right({
      project,
    })
  }
}
