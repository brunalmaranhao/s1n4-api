import { VerificationToken } from './../../enterprise/entities/verificationToken'

export abstract class VerificationTokenRepository {
  abstract findByUserAndToken(
    userId: string,
    token: string,
  ): Promise<VerificationToken | null>

  abstract create(
    verificationToken: VerificationToken,
  ): Promise<VerificationToken>

  abstract findByUserAndPermissionTimeResend(
    userId: string,
    time: Date,
  ): Promise<VerificationToken | null>
}
