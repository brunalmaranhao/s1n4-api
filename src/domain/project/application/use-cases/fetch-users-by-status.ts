import { Either, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { Status } from '@prisma/client'
import { User } from '../../enterprise/entities/user'
import { UserRepository } from '../repositories/user-repository'

interface FetchUsersByStatusUseCaseRequest {
  page: number
  status: Status
}

type FetchUsersByStatusUseCaseResponse = Either<
  null,
  {
    users: User[]
  }
>

@Injectable()
export class FetchUsersByStatusUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute({
    status,
    page,
  }: FetchUsersByStatusUseCaseRequest): Promise<FetchUsersByStatusUseCaseResponse> {
    const users = await this.userRepository.fetchByStatus(status, {
      page,
    })

    return right({
      users,
    })
  }
}
