import {
  VerificationToken as PrismaVerificationToken,
  Prisma,
} from '@prisma/client'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { VerificationToken } from '@/domain/project/enterprise/entities/verificationToken'

export class PrismaVerificationTokenMapper {
  static toDomain(raw: PrismaVerificationToken): VerificationToken {
    return VerificationToken.create(
      {
        token: raw.token,
        userId: new UniqueEntityID(raw.id),
        createAt: raw.createAt,
        updatedAt: raw.updatedAt,
        type: raw.type,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(
    verificationToken: VerificationToken,
  ): Prisma.VerificationTokenUncheckedCreateInput {
    return {
      id: verificationToken.id.toString(),
      userId: verificationToken.userId.toString(),
      createAt: verificationToken.createAt,
      updatedAt: verificationToken.updatedAt,
      token: verificationToken.token,
      type: verificationToken.type,
    }
  }
}
