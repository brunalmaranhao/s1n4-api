import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { ListProjectRepository } from '../repositories/list-projects-repository'
import { ListProjects } from '../../enterprise/entities/listProjects'
import { UserNotFoundError } from './errors/user-not-found-error'
import { UserRepository } from '../repositories/user-repository'

interface FetchListProjectsByUserUseCaseRequest {
  userId: string
}

type FetchListProjectsByUserUseCaseResponse = Either<
  UserNotFoundError,
  {
    listProjects: ListProjects[]
  }
>

@Injectable()
export class FetchListProjectsByUserUseCase {
  constructor(
    private listProjectRepository: ListProjectRepository,
    private userRepository: UserRepository,
  ) {}

  async execute({
    userId,
  }: FetchListProjectsByUserUseCaseRequest): Promise<FetchListProjectsByUserUseCaseResponse> {
    const user = await this.userRepository.findById(userId)
    if (!user) return left(new UserNotFoundError())

    if (user.customerId) {
      const listProjects = await this.listProjectRepository.findByCustomerId(
        user?.customerId?.toString(),
      )
      return right({
        listProjects,
      })
    }

    return left(new UserNotFoundError())
  }
}
