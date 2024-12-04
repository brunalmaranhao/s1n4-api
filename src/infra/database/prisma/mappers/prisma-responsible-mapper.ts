import { ResponsibleParties as PrismaResponsible, Prisma } from '@prisma/client'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ResponsibleParties } from '@/domain/project/enterprise/entities/responsibleParties'

export class PrismaResponsibleMapper {
  static toDomain(raw: PrismaResponsible): ResponsibleParties {
    return ResponsibleParties.create(
      {
        firstName: raw.firstName,
        lastName: raw.lastName,
        email: raw.email,
        birthdate: raw.birthdate,
        phone: raw.phone,
        customerId: new UniqueEntityID(raw.customerId),
        status: raw.status,
        createdAt: raw.createdAt,
        responsiblePartiesRole: raw.responsiblePartiesRole,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(
    responsible: ResponsibleParties,
  ): Prisma.ResponsiblePartiesUncheckedCreateInput {
    return {
      id: responsible.id.toString(),
      firstName: responsible.firstName,
      lastName: responsible.lastName,
      birthdate: responsible.birthdate,
      createdAt: responsible.createdAt,
      updatedAt: responsible.updatedAt,
      email: responsible.email,
      phone: responsible.phone,
      customerId: responsible.customerId.toString(),
      status: responsible.status,
      responsiblePartiesRole: responsible.responsiblePartiesRole,
    }
  }
}
