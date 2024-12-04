import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { UserEditProps } from '@/core/types/user-props'
import { User } from '../../enterprise/entities/user'
import { UserNotFoundError } from './errors/user-not-found-error'
import { UserRepository } from '../repositories/user-repository'

interface UpdateCustomerUseCaseRequest {
  id: string
  user: UserEditProps
}

type UpdateCustomerUseCaseResponse = Either<
  UserNotFoundError,
  {
    user: User
  }
>

@Injectable()
export class UpdateUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute({
    id,
    user,
  }: UpdateCustomerUseCaseRequest): Promise<UpdateCustomerUseCaseResponse> {
    const existUser = await this.userRepository.findById(id)

    if (!existUser) {
      return left(new UserNotFoundError())
    }

    const newUser = await this.userRepository.update(id, user)

    return right({
      user: newUser,
    })
  }
}
