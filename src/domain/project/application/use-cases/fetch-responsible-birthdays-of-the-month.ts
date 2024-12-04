import { Injectable } from '@nestjs/common'
import { ResponsiblePartiesRepository } from '../repositories/responsible-parties'
import { ResponsibleParties } from '../../enterprise/entities/responsibleParties'
import { Either, right } from '@/core/either'

interface FetchResponsibleBirthdaysOfTheMonthUseCaseRequest {
  page: number
}

type FetchResponsibleBirthdaysOfTheMonthUseCaseResponse = Either<
  null,
  {
    responsiblesBirthdayOfTheMonth: ResponsibleParties[]
  }
>

@Injectable()
export class FetchResponsibleBirthdaysOfTheMonthUseCase {
  constructor(
    private responsiblePartiesRepository: ResponsiblePartiesRepository,
  ) {}

  async execute({
    page,
  }: FetchResponsibleBirthdaysOfTheMonthUseCaseRequest): Promise<FetchResponsibleBirthdaysOfTheMonthUseCaseResponse> {
    const responsiblesBirthdayOfTheMonth =
      await this.responsiblePartiesRepository.fetchBirthdaysOfTheMonth({
        page,
      })

    return right({
      responsiblesBirthdayOfTheMonth,
    })
  }
}
