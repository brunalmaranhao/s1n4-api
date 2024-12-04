import { Either, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { Status } from '@prisma/client'
import { ResponsiblePartiesRepository } from '../repositories/responsible-parties'
import { ResponsibleParties } from '../../enterprise/entities/responsibleParties'

interface FetchResponsiblePartiesByStatusUseCaseRequest {
  page: number
  status: Status
}

type FetchResponsiblePartiesByStatusUseCaseResponse = Either<
  null,
  {
    responsible: ResponsibleParties[]
  }
>

@Injectable()
export class FetchResponsiblePartiesByStatusUseCase {
  constructor(
    private responsiblePartiesRepository: ResponsiblePartiesRepository,
  ) {}

  async execute({
    status,
    page,
  }: FetchResponsiblePartiesByStatusUseCaseRequest): Promise<FetchResponsiblePartiesByStatusUseCaseResponse> {
    const responsible = await this.responsiblePartiesRepository.fetchByStatus(
      status,
      {
        page,
      },
    )

    return right({
      responsible,
    })
  }
}
