import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ListProjectRepository } from '../repositories/list-projects-repository'
import { ListProjectAlreadyExistsError } from './errors/list-project-already-exists'
import { ListProjects } from '../../enterprise/entities/listProjects'

interface CreateListProjectUseCaseRequest {
  name: string
  customerId: string
  isDone?: boolean
}

type CreateListProjectUseCaseResponse = Either<
  ListProjectAlreadyExistsError,
  {
    listProject: ListProjects
  }
>

@Injectable()
export class CreateListProjectUseCase {
  constructor(private listProjectRepository: ListProjectRepository) {}

  async execute({
    name,
    customerId,
    isDone,
  }: CreateListProjectUseCaseRequest): Promise<CreateListProjectUseCaseResponse> {
    const listProjectAlreadyExists =
      await this.listProjectRepository.findByNameAndCustomerId(customerId, name)

    if (
      listProjectAlreadyExists &&
      listProjectAlreadyExists.status === 'ACTIVE'
    ) {
      return left(new ListProjectAlreadyExistsError())
    }

    const listProjectsByCustomer =
      await this.listProjectRepository.findByCustomerId(customerId)
    const finalOrder =
      listProjectsByCustomer.length > 0
        ? listProjectsByCustomer[listProjectsByCustomer.length - 1].order
        : 0

    const newListProject = ListProjects.create({
      name,
      customerId: new UniqueEntityID(customerId),
      order: finalOrder + 1,
      isDone: isDone ?? false,
    })

    const listProject = await this.listProjectRepository.create(newListProject)

    return right({
      listProject,
    })
  }
}
