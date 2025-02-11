import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { HashComparer } from '../cryptography/hash-comparer'
import { Encrypter } from '../cryptography/encrypter'
import { WrongCredentialsError } from './errors/wrong-credentials-error'
import { UserRepository } from '../repositories/user-repository'
import { UserInactiveError } from './errors/user-inactive-error'

interface AuthenticateUserUseCaseRequest {
  email: string
  password: string
}

type AuthenticateUserUseCaseResponse = Either<
  WrongCredentialsError | UserInactiveError,
  {
    accessToken: string
  }
>

@Injectable()
export class AuthenticateUserUseCase {
  constructor(
    private userRepository: UserRepository,
    private hashComparer: HashComparer,
    private encrypter: Encrypter,
  ) {}

  async execute({
    email,
    password,
  }: AuthenticateUserUseCaseRequest): Promise<AuthenticateUserUseCaseResponse> {
    const user = await this.userRepository.findByEmail(email)

    if (!user || !user.password) {
      return left(new WrongCredentialsError())
    }

    if (user.status === 'INACTIVE') {
      return left(new UserInactiveError())
    }

    const isPasswordValid = await this.hashComparer.compare(
      password,
      user.password,
    )

    if (!isPasswordValid) {
      return left(new WrongCredentialsError())
    }

    const accessToken = await this.encrypter.encrypt({
      sub: user.id.toString(),
      role: user.role,
      permissions: user.department?.permissions,
    })

    return right({
      accessToken,
    })
  }
}
