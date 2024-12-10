import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { ListProjectRepository } from '../repositories/list-projects-repository'
import { ListProjectNotFoundError } from './errors/list-project-not-found-error'
import { ListProjects } from '../../enterprise/entities/listProjects'

interface UpdateListProjectUseCaseRequest {
  id: string
  name: string
}

type UpdateListProjectUseCaseResponse = Either<
  ListProjectNotFoundError,
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
    const listProjectAlreadyExistsError =
      await this.listProjectRepository.findById(id)

    if (!listProjectAlreadyExistsError) {
      return left(new ListProjectNotFoundError())
    }

    const listProject = await this.listProjectRepository.update(id, name)

    return right({ listProject })
  }
}
