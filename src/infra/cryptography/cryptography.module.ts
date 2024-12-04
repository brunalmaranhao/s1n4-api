import { Module } from '@nestjs/common'

import { Encrypter } from '@/domain/project/application/cryptography/encrypter'
import { HashComparer } from '@/domain/project/application/cryptography/hash-comparer'
import { HashGenerator } from '@/domain/project/application/cryptography/hash-generator'

import { JwtEncrypter } from './jwt-encrypter'
import { BcryptHasher } from './bcrypt-hasher'
import { EncrypterValidationToken } from '@/domain/project/application/cryptography/encrypter-account-validation'
import { JwtEncrypterAccountValidation } from './jwt-encrypter-account-validation'
import { EnvService } from '../env/env.service'

@Module({
  providers: [
    { provide: Encrypter, useClass: JwtEncrypter },
    {
      provide: EncrypterValidationToken,
      useClass: JwtEncrypterAccountValidation,
    },
    { provide: HashComparer, useClass: BcryptHasher },
    { provide: HashGenerator, useClass: BcryptHasher },
    EnvService,
  ],
  exports: [Encrypter, HashComparer, HashGenerator, EncrypterValidationToken],
})
export class CryptographyModule {}
