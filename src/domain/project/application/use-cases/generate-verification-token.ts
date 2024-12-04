import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { UserRepository } from '../repositories/user-repository'
import { subMinutes } from 'date-fns'
import { EncrypterValidationToken } from '../cryptography/encrypter-account-validation'
import { EmailNotFoundError } from './errors/email-not-found-error'
import { FileResendNotAllowedInTimeError } from './errors/file-resend-not-allowed-error'
import { VerificationTokenRepository } from '../repositories/verification-token-repository'
import { VerificationToken } from '../../enterprise/entities/verificationToken'

interface GenerateVerificationTokenUseCaseRequest {
  email: string
  date: Date
}

type GenerateVerificationTokenCaseResponse = Either<
  EmailNotFoundError | FileResendNotAllowedInTimeError,
  {
    token: string
  }
>

@Injectable()
export class GenerateVerificationTokenUseCase {
  constructor(
    private userRepository: UserRepository,
    private encrypter: EncrypterValidationToken,
    private verificationTokenRepository: VerificationTokenRepository,
  ) {}

  async execute({
    email,
    date,
  }: GenerateVerificationTokenUseCaseRequest): Promise<GenerateVerificationTokenCaseResponse> {
    const user = await this.userRepository.findByEmail(email)

    if (!user) {
      return left(new EmailNotFoundError(`E-mail ${email} não encontrado.`))
    }

    const existVerificationToken =
      await this.verificationTokenRepository.findByUserAndPermissionTimeResend(
        user.id.toString(),
        date,
        // subMinutes(new Date(), 1),
      )
    if (existVerificationToken) {
      return left(new FileResendNotAllowedInTimeError())
    }

    const token = this.encrypter.generateEmailVerificationToken(
      user.id.toString(),
      user.email,
    )
    const verificationToken = VerificationToken.create({
      token,
      userId: user.id,
    })
    await this.verificationTokenRepository.create(verificationToken)
    return right({
      token,
    })
  }
}
