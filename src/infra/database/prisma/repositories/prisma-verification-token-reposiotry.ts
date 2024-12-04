import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { VerificationTokenRepository } from '@/domain/project/application/repositories/verification-token-repository'
import { VerificationToken } from '@/domain/project/enterprise/entities/verificationToken'
import { PrismaVerificationTokenMapper } from '../mappers/prisma-verification-token-mapper'

@Injectable()
export class PrismaVerificationTokenRepository
  implements VerificationTokenRepository
{
  constructor(private prisma: PrismaService) {}
  async findByUserAndToken(
    userId: string,
    token: string,
  ): Promise<VerificationToken | null> {
    const verificationToken = await this.prisma.verificationToken.findUnique({
      where: {
        userId,
        token,
      },
    })

    if (!verificationToken) return null

    return PrismaVerificationTokenMapper.toDomain(verificationToken)
  }

  async findByUserAndPermissionTimeResend(
    userId: string,
    time: Date,
  ): Promise<VerificationToken | null> {
    const verificationCode = await this.prisma.verificationToken.findFirst({
      where: {
        userId,
        createAt: {
          gte: time,
        },
      },
    })

    if (!verificationCode) return null

    return PrismaVerificationTokenMapper.toDomain(verificationCode)
  }

  async create(
    verificationToken: VerificationToken,
  ): Promise<VerificationToken> {
    const data = PrismaVerificationTokenMapper.toPrisma(verificationToken)

    const newVerificationToken = await this.prisma.verificationToken.create({
      data,
    })
    return PrismaVerificationTokenMapper.toDomain(newVerificationToken)
  }
}
