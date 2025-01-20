import { Either, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { Status } from '@prisma/client'
import { ResponsiblePartiesRepository } from '../repositories/responsible-parties'
import { ResponsibleParties } from '../../enterprise/entities/responsibleParties'

type FetchActiveResponsiblePartiesUseCaseResponse = Either<
  null,
  {
    responsible: ResponsibleParties[]
  }
>

@Injectable()
export class FetchActiveResponsiblePartiesUseCase {
  constructor(
    private responsiblePartiesRepository: ResponsiblePartiesRepository,
  ) {}

  async execute(): Promise<FetchActiveResponsiblePartiesUseCaseResponse> {
    const responsible =
      await this.responsiblePartiesRepository.fetchAllResponsibleParties()

    return right({
      responsible,
    })
  }
}
