import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { ListProjectRepository } from '../repositories/list-projects-repository'
import { ListProjectNotFoundError } from './errors/list-project-not-found-error'
import { ProjectRepository } from '../repositories/project-repository'

interface RemoveListProjectUseCaseRequest {
  id: string
}

type RemoveListProjectUseCaseResponse = Either<ListProjectNotFoundError, null>

@Injectable()
export class RemoveListProjectUseCase {
  constructor(
    private listProjectRepository: ListProjectRepository,
    private projectRepository: ProjectRepository,
  ) {}

  async execute({
    id,
  }: RemoveListProjectUseCaseRequest): Promise<RemoveListProjectUseCaseResponse> {
    const listProject = await this.listProjectRepository.findById(id)

    if (!listProject) {
      return left(new ListProjectNotFoundError())
    }

    await this.listProjectRepository.remove(id)
    listProject.projects?.map(
      async (project) =>
        await this.projectRepository.remove(project.id.toString()),
    )

    return right(null)
  }
}
