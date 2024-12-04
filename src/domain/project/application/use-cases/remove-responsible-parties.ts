import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { ResponsiblePartiesNotFoundError } from './errors/responsible-not-found-error'
import { ResponsiblePartiesRepository } from '../repositories/responsible-parties'

interface RemoveResponsiblePartiesUseCaseRequest {
  id: string
}

type RemoveResponsiblePartiesUseCaseResponse = Either<
  ResponsiblePartiesNotFoundError,
  null
>

@Injectable()
export class RemoveResponsiblePartiesUseCase {
  constructor(
    private responsiblePartiesRepository: ResponsiblePartiesRepository,
  ) {}

  async execute({
    id,
  }: RemoveResponsiblePartiesUseCaseRequest): Promise<RemoveResponsiblePartiesUseCaseResponse> {
    const responsibleParties =
      await this.responsiblePartiesRepository.findById(id)

    if (!responsibleParties) {
      return left(new ResponsiblePartiesNotFoundError(id))
    }

    await this.responsiblePartiesRepository.remove(id)

    return right(null)
  }
}
