import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ProjectAlreadyExistsError } from './errors/project-already-exists'
import { Project } from '../../enterprise/entities/project'
import { ProjectRepository } from '../repositories/project-repository'

interface CreateProjectUseCaseRequest {
  name: string
  customerId: string
  deadline: Date | null
  budget: number
  listProjectsId: string
}

type CreateProjectUseCaseResponse = Either<
  ProjectAlreadyExistsError,
  {
    project: Project
  }
>

@Injectable()
export class CreateProjectUseCase {
  constructor(private projectRepository: ProjectRepository) {}

  async execute({
    name,
    customerId,
    deadline,
    budget,
    listProjectsId,
  }: CreateProjectUseCaseRequest): Promise<CreateProjectUseCaseResponse> {
    const projectAlreadyExists =
      await this.projectRepository.findByNameAndCustomer(name, customerId)

    if (projectAlreadyExists) {
      return left(new ProjectAlreadyExistsError())
    }

    const newProject = Project.create({
      name,
      customerId: new UniqueEntityID(customerId),
      deadline,
      budget,
      listProjectsId: new UniqueEntityID(listProjectsId),
      updatedListProjectAt: new Date(),
    })

    const project = await this.projectRepository.create(newProject)

    return right({
      project,
    })
  }
}
