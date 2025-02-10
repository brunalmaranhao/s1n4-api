import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { ProjectNotFoundError } from './errors/project-not-found-error'
import { Project } from '../../enterprise/entities/project'
import { ProjectRepository } from '../repositories/project-repository'

interface UpdateProjectNameUseCaseRequest {
  id: string
  name: string
}

type UpdateProjectNameUseCaseResponse = Either<
  ProjectNotFoundError,
  {
    project: Project
  }
>

@Injectable()
export class UpdateProjectNameUseCase {
  constructor(private projectRepository: ProjectRepository) {}

  async execute({
    id,
    name,
  }: UpdateProjectNameUseCaseRequest): Promise<UpdateProjectNameUseCaseResponse> {
    const projectExists = await this.projectRepository.findById(id)

    if (!projectExists) {
      return left(new ProjectNotFoundError())
    }

    const updatedProject = await this.projectRepository.updateName(id, name)

    return right({
      project: updatedProject,
    })
  }
}
