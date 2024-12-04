import { UserRepository } from '@/domain/project/application/repositories/user-repository'
import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { Status } from '@prisma/client'
import { ProjectUpdate } from '../../enterprise/entities/projectUpdates'
import { ProjectUpdateRepository } from '../repositories/project-update-repository'
import { WrongCredentialsError } from './errors/wrong-credentials-error'

interface FetchProjectUpdateByStatusUseCaseRequest {
  page: number
  status: Status
  customerId: string
  requesterId?: string
}

type FetchProjectUpdateByStatusUseCaseResponse = Either<
  WrongCredentialsError,
  {
    projectUpdates: ProjectUpdate[]
  }
>

@Injectable()
export class FetchProjectUpdateByStatusUseCase {
  constructor(
    private projectRepository: ProjectUpdateRepository,
    private userRepository: UserRepository,
  ) {}

  async execute({
    status,
    requesterId,
    customerId,
    page,
  }: FetchProjectUpdateByStatusUseCaseRequest): Promise<FetchProjectUpdateByStatusUseCaseResponse> {
    if (requesterId) {
      const user = await this.userRepository.findById(requesterId)

      if (user?.customerId?.toString() !== customerId) {
        return left(new WrongCredentialsError())
      }
    }

    const projectUpdates =
      await this.projectRepository.fetchByStatusAndCustomerId(
        status,
        customerId,
        {
          page,
        },
      )

    return right({
      projectUpdates,
    })
  }
}
