import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { CustomerRepository } from '../repositories/customer-repository'
import { ResponsiblePartiesNotFoundError } from './errors/responsible-not-found-error'
import { ResponsibleParties } from '../../enterprise/entities/responsibleParties'
import { ResponsiblePartiesRepository } from '../repositories/responsible-parties'

interface FetchResponsiblePartiesByIdUseCaseRequest {
  id: string
}

type FetchResponsiblePartiesByIdUseCaseResponse = Either<
  ResponsiblePartiesNotFoundError,
  {
    responsible: ResponsibleParties
  }
>

@Injectable()
export class FetchResponsiblePartiesByIdUseCase {
  constructor(
    private responsiblePartiesRepository: ResponsiblePartiesRepository,
  ) {}

  async execute({
    id,
  }: FetchResponsiblePartiesByIdUseCaseRequest): Promise<FetchResponsiblePartiesByIdUseCaseResponse> {
    const responsible = await this.responsiblePartiesRepository.findById(id)

    if (!responsible) {
      return left(new ResponsiblePartiesNotFoundError(id))
    }

    return right({
      responsible,
    })
  }
}
