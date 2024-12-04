import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { ResponsiblePartiesEditProps } from '@/core/types/responsilbe-parties-props'
import { ResponsiblePartiesNotFoundError } from './errors/responsible-not-found-error'
import { ResponsibleParties } from '../../enterprise/entities/responsibleParties'
import { ResponsiblePartiesRepository } from '../repositories/responsible-parties'

interface UpdateResponsiblePartiesUseCaseRequest {
  id: string
  responsibleParties: ResponsiblePartiesEditProps
}

type UpdateResponsiblePartiesUseCaseResponse = Either<
  ResponsiblePartiesNotFoundError,
  {
    responsibleParties: ResponsibleParties
  }
>

@Injectable()
export class UpdateResponsiblePartiesUseCase {
  constructor(
    private responsiblePartiesRepository: ResponsiblePartiesRepository,
  ) {}

  async execute({
    id,
    responsibleParties,
  }: UpdateResponsiblePartiesUseCaseRequest): Promise<UpdateResponsiblePartiesUseCaseResponse> {
    const existResponsibleParties =
      await this.responsiblePartiesRepository.findById(id)

    if (!existResponsibleParties) {
      return left(new ResponsiblePartiesNotFoundError(id))
    }

    const newResponsibleParties =
      await this.responsiblePartiesRepository.update(id, responsibleParties)

    return right({
      responsibleParties: newResponsibleParties,
    })
  }
}
