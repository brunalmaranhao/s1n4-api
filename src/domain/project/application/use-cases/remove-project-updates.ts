import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { ProjectUpdateRepository } from '../repositories/project-update-repository'
import { ProjectUpdatesNotFoundError } from './errors/project-updates-not-found-error'

interface RemoveProjectUpdatesUseCaseRequest {
  id: string
}

type RemoveProjectUpdatesUseCaseResponse = Either<
  ProjectUpdatesNotFoundError,
  null
>

@Injectable()
export class RemoveProjectUpdatesUseCase {
  constructor(private projectUpdateRepository: ProjectUpdateRepository) {}

  async execute({
    id,
  }: RemoveProjectUpdatesUseCaseRequest): Promise<RemoveProjectUpdatesUseCaseResponse> {
    const project = await this.projectUpdateRepository.findById(id)

    if (!project) {
      return left(new ProjectUpdatesNotFoundError())
    }

    await this.projectUpdateRepository.remove(id)

    return right(null)
  }
}
