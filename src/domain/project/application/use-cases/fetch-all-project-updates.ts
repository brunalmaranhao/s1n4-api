import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { Status } from '@prisma/client'
import { ProjectUpdate } from '../../enterprise/entities/projectUpdates'
import { ProjectUpdateRepository } from '../repositories/project-update-repository'

interface FetchAllProjectUpdatesUseCaseRequest {
  page: number
  status: Status
}

type FetchAllProjectUpdatesUseCaseResponse = Either<
  null,
  {
    projectUpdates: ProjectUpdate[]
  }
>

@Injectable()
export class FetchAllProjectUpdatesUseCase {
  constructor(private projectUpdatesRepository: ProjectUpdateRepository) {}

  async execute({
    status,
    page,
  }: FetchAllProjectUpdatesUseCaseRequest): Promise<FetchAllProjectUpdatesUseCaseResponse> {
    const projectUpdates =
      await this.projectUpdatesRepository.fetchAllProjectUpdates(
        {
          page,
        },
        status,
      )

    return right({
      projectUpdates,
    })
  }
}
