import { Either, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { Status } from '@prisma/client'
import { ResponsiblePartiesRepository } from '../repositories/responsible-parties'
import { ResponsibleParties } from '../../enterprise/entities/responsibleParties'

interface FetchResponsibleBirthdaysOfTheDayUseCaseRequest {
  page: number
}

type FetchResponsibleBirthdaysOfTheDayUseCaseResponse = Either<
  null,
  {
    responsiblesBirthday: ResponsibleParties[]
  }
>

@Injectable()
export class FetchResponsibleBirthdaysOfTheDayUseCase {
  constructor(
    private responsiblePartiesRepository: ResponsiblePartiesRepository,
  ) {}

  async execute({
    page,
  }: FetchResponsibleBirthdaysOfTheDayUseCaseRequest): Promise<FetchResponsibleBirthdaysOfTheDayUseCaseResponse> {
    const responsiblesBirthday =
      await this.responsiblePartiesRepository.fetchBirthdaysOfTheDay({
        page,
      })

    return right({
      responsiblesBirthday,
    })
  }
}
