import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { EditProjectProps } from '@/core/types/edit-project-props'
import { ProjectNotFoundError } from './errors/project-not-found-error'
import { Project } from '../../enterprise/entities/project'
import { ProjectRepository } from '../repositories/project-repository'

interface UpdateProjectUseCaseRequest {
  id: string
  project: EditProjectProps
}

type UpdateProjectUseCaseResponse = Either<
  ProjectNotFoundError,
  {
    project: Project
  }
>

@Injectable()
export class UpdateProjectUseCase {
  constructor(private projectRepository: ProjectRepository) {}

  async execute({
    id,
    project,
  }: UpdateProjectUseCaseRequest): Promise<UpdateProjectUseCaseResponse> {
    const projectExists = await this.projectRepository.findById(id)

    if (!projectExists) {
      return left(new ProjectNotFoundError())
    }

    const updatedProject = await this.projectRepository.update(id, project)

    return right({
      project: updatedProject,
    })
  }
}
