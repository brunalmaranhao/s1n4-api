import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { ListProjectRepository } from '../repositories/list-projects-repository'
import { ListProjectNotFoundError } from './errors/list-project-not-found-error'
import { ProjectRepository } from '../repositories/project-repository'
import { ListProjectCannotBeDeletedError } from './errors/list-project-cannot-be-deleted'

interface RemoveListProjectUseCaseRequest {
  id: string
}

type RemoveListProjectUseCaseResponse = Either<
  ListProjectNotFoundError | ListProjectCannotBeDeletedError,
  null
>

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
    if (listProject.isDone) {
      return left(new ListProjectCannotBeDeletedError())
    }

    await this.listProjectRepository.remove(id)
    listProject.projects?.map(
      async (project) =>
        await this.projectRepository.remove(project.id.toString()),
    )

    return right(null)
  }
}
