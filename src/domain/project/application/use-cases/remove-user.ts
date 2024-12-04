import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { UserRepository } from '../repositories/user-repository'
import { UserNotFoundError } from './errors/user-not-found-error'

interface RemoveUserUseCaseRequest {
  id: string
}

type RemoveUserUseCaseResponse = Either<UserNotFoundError, null>

@Injectable()
export class RemoveUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute({
    id,
  }: RemoveUserUseCaseRequest): Promise<RemoveUserUseCaseResponse> {
    const user = await this.userRepository.findById(id)

    if (!user) {
      return left(new UserNotFoundError())
    }

    await this.userRepository.remove(id)

    return right(null)
  }
}
