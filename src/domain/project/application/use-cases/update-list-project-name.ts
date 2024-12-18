import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { ListProjectRepository } from '../repositories/list-projects-repository'
import { ListProjectNotFoundError } from './errors/list-project-not-found-error'
import { ListProjects } from '../../enterprise/entities/listProjects'
import { ListProjectCannotBeEditedError } from './errors/list-project-cannot-be-edited'

interface UpdateListProjectUseCaseRequest {
  id: string
  name: string
}

type UpdateListProjectUseCaseResponse = Either<
  ListProjectNotFoundError | ListProjectCannotBeEditedError,
  {
    listProject: ListProjects
  }
>

@Injectable()
export class UpdateListProjectUseCase {
  constructor(private listProjectRepository: ListProjectRepository) {}

  async execute({
    id,
    name,
  }: UpdateListProjectUseCaseRequest): Promise<UpdateListProjectUseCaseResponse> {
    const listProjectAlreadyExists =
      await this.listProjectRepository.findById(id)

    if (!listProjectAlreadyExists) {
      return left(new ListProjectNotFoundError())
    }

    if (listProjectAlreadyExists.isDone) {
      return left(new ListProjectCannotBeEditedError())
    }

    const listProject = await this.listProjectRepository.update(id, name)

    return right({ listProject })
  }
}
