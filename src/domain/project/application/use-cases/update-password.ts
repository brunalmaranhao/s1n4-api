import { UserRepository } from '@/domain/project/application/repositories/user-repository'
import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'

import { HashGenerator } from '../cryptography/hash-generator'
import { UpdatePasswordError } from './errors/update-password-error'

interface UpdatePasswordUseCaseRequest {
  userId: string
  password: string
}

type UpdatePasswordUseCaseResponse = Either<UpdatePasswordError, null>

@Injectable()
export class UpdatePasswordUseCase {
  constructor(
    private userRepository: UserRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    userId,
    password,
  }: UpdatePasswordUseCaseRequest): Promise<UpdatePasswordUseCaseResponse> {
    try {
      const hashedPassword = await this.hashGenerator.hash(password)
      await this.userRepository.updatePassword(userId, hashedPassword)
      return right(null)
    } catch (error) {
      return left(new UpdatePasswordError())
    }
  }
}
