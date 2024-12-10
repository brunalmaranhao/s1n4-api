import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { ProjectNotFoundError } from './errors/project-not-found-error'
import { ProjectRepository } from '../repositories/project-repository'

interface UpdateShouldShowInformationsUseCaseRequest {
  id: string
  shouldShowInformations: boolean
}

type UpdateShouldShowInformationsUseCaseResponse = Either<
  ProjectNotFoundError,
  null
>

@Injectable()
export class UpdateShouldShowInformationsUseCase {
  constructor(private projectRepository: ProjectRepository) {}

  async execute({
    id,
    shouldShowInformations,
  }: UpdateShouldShowInformationsUseCaseRequest): Promise<UpdateShouldShowInformationsUseCaseResponse> {
    const projectExists = await this.projectRepository.findById(id)

    if (!projectExists) {
      return left(new ProjectNotFoundError())
    }

    await this.projectRepository.updateShouldShowInformationsToCustomerUser(
      id,
      shouldShowInformations,
    )

    return right(null)
  }
}
