import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { EnvService } from '../env/env.service'
import { EncrypterValidationToken } from '@/domain/project/application/cryptography/encrypter-account-validation'

@Injectable()
export class JwtEncrypterAccountValidation implements EncrypterValidationToken {
  constructor(
    private readonly jwtService: JwtService,
    private config: EnvService,
  ) {}

  generateEmailVerificationToken(userId: string, email: string): string {
    return this.jwtService.sign(
      { sub: userId, email },
      {
        secret: this.config.get('JWT_PRIVATE_KEY'),
        expiresIn: '20m',
        algorithm: 'HS256',
      },
    )
  }

  async validateEmailVerificationToken(token: string): Promise<boolean> {
    try {
      this.jwtService.verify(token, {
        secret: this.config.get('JWT_PRIVATE_KEY'),
        algorithms: ['HS256'],
      })

      return true
    } catch (error) {
      return false
    }
  }
}
