import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { ProjectUpdateRepository } from '../repositories/project-update-repository'
import { ProjectUpdatesNotFoundError } from './errors/project-updates-not-found-error'
import { ProjectUpdate } from '../../enterprise/entities/projectUpdates'

interface UpdateProjectUpdateUseCaseRequest {
  id: string
  description: string
}

type UpdateProjectUpdateUseCaseResponse = Either<
  ProjectUpdatesNotFoundError,
  {
    projectUpdate: ProjectUpdate
  }
>

@Injectable()
export class UpdateProjectUpdateUseCase {
  constructor(private projectRepository: ProjectUpdateRepository) {}

  async execute({
    id,
    description,
  }: UpdateProjectUpdateUseCaseRequest): Promise<UpdateProjectUpdateUseCaseResponse> {
    const projectExists = await this.projectRepository.findById(id)

    if (!projectExists) {
      return left(new ProjectUpdatesNotFoundError())
    }

    const updatedProject = await this.projectRepository.update(id, description)

    return right({
      projectUpdate: updatedProject,
    })
  }
}
