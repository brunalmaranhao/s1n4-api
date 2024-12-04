import { faker } from '@faker-js/faker'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import {
  ResponsibleParties,
  ResponsiblePartiesProps,
} from '@/domain/project/enterprise/entities/responsibleParties'
import { PrismaResponsibleMapper } from '@/infra/database/prisma/mappers/prisma-responsible-mapper'
import { randomUUID } from 'crypto'

export function makeResponsibleParties(
  override: Partial<ResponsiblePartiesProps> = {},
  id?: UniqueEntityID,
) {
  const responsibleParties = ResponsibleParties.create(
    {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      status: 'ACTIVE',
      phone: '81997272722',
      birthdate: new Date('1988-06-03T00:00:00.000Z'),
      customerId: new UniqueEntityID(),
      responsiblePartiesRole: override.responsiblePartiesRole ?? ['CODE'],
      ...override,
    },
    id,
  )

  return responsibleParties
}

@Injectable()
export class ResponsiblePartiesFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaResponsibleParties(
    data: Partial<ResponsiblePartiesProps> = {},
  ): Promise<ResponsibleParties> {
    const responsibleParties = makeResponsibleParties(data)

    await this.prisma.responsibleParties.create({
      data: PrismaResponsibleMapper.toPrisma(responsibleParties),
    })

    return responsibleParties
  }
}
