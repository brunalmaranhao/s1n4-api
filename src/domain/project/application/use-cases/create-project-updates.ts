import { Either, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { ProjectUpdate } from '../../enterprise/entities/projectUpdates'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ProjectUpdateRepository } from '../repositories/project-update-repository'

interface CreateProjectUpdateUseCaseRequest {
  userId: string
  projectId: string
  description: string
}

type CreateProjectUpdateUseCaseResponse = Either<
  null,
  {
    projectUpdate: ProjectUpdate
  }
>

@Injectable()
export class CreateProjectUpdateUseCase {
  constructor(private projectUpdateRepository: ProjectUpdateRepository) {}

  async execute({
    description,
    projectId,
    userId,
  }: CreateProjectUpdateUseCaseRequest): Promise<CreateProjectUpdateUseCaseResponse> {
    const newProjectUpdates = ProjectUpdate.create({
      userId: new UniqueEntityID(userId),
      projectId: new UniqueEntityID(projectId),
      description,
    })

    const projectUpdateCreated =
      await this.projectUpdateRepository.create(newProjectUpdates)

    return right({
      projectUpdate: projectUpdateCreated,
    })
  }
}
