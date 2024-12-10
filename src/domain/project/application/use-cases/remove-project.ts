import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { ProjectNotFoundError } from './errors/project-not-found-error'
import { ProjectRepository } from '../repositories/project-repository'
import { ProjectAlreadyCanceledError } from './errors/project-already-canceled-error'

interface RemoveProjectUseCaseRequest {
  id: string
}

type RemoveProjectUseCaseResponse = Either<
  ProjectNotFoundError | ProjectAlreadyCanceledError,
  null
>

@Injectable()
export class RemoveProjectUseCase {
  constructor(private projectRepository: ProjectRepository) {}

  async execute({
    id,
  }: RemoveProjectUseCaseRequest): Promise<RemoveProjectUseCaseResponse> {
    const project = await this.projectRepository.findById(id)

    if (!project) {
      return left(new ProjectNotFoundError())
    }

    await this.projectRepository.remove(id)

    return right(null)
  }
}
