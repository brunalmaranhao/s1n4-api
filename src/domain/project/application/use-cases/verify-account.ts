import { VerificationTokenRepository } from '@/domain/project/application/repositories/verification-token-repository'
import { UserRepository } from '@/domain/project/application/repositories/user-repository'
import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'

import { UserNotFoundError } from './errors/user-not-found-error'
import { EncrypterValidationToken } from '../cryptography/encrypter-account-validation'
import { TokenNotValidFoundError } from './errors/token-not-valid-error'
import { User } from '../../enterprise/entities/user'

interface VerifyAccountUseCaseRequest {
  token: string
  email: string
}

type VerifyAccountUseCaseResponse = Either<
  TokenNotValidFoundError | UserNotFoundError,
  {
    user: User
  }
>

@Injectable()
export class VerifyAccountUseCase {
  constructor(
    private userRepository: UserRepository,
    private encrypter: EncrypterValidationToken,
    private verificationTokenRepository: VerificationTokenRepository,
  ) {}

  async execute({
    email,
    token,
  }: VerifyAccountUseCaseRequest): Promise<VerifyAccountUseCaseResponse> {
    const user = await this.userRepository.findByEmail(email)

    if (!user) {
      return left(new UserNotFoundError())
    }

    const verificationToken =
      await this.verificationTokenRepository.findByUserAndToken(
        user.id.toString(),
        token,
      )

    if (!verificationToken) {
      return left(new TokenNotValidFoundError('Token não encontado.'))
    }
    const isValid = await this.encrypter.validateEmailVerificationToken(
      verificationToken?.token,
    )

    if (!isValid) {
      return left(new TokenNotValidFoundError('Token não válido ou expirado.'))
    }

    return right({ user })
  }
}
