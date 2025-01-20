import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { ResponsiblePartiesRepository } from '@/domain/project/application/repositories/responsible-parties'
import { ResponsibleParties } from '@/domain/project/enterprise/entities/responsibleParties'
import { PrismaResponsibleMapper } from '../mappers/prisma-responsible-mapper'
import { ResponsiblePartiesEditProps } from '@/core/types/responsilbe-parties-props'
import { Status } from '@prisma/client'

@Injectable()
export class PrismaResponsibleRepository
  implements ResponsiblePartiesRepository
{
  constructor(private prisma: PrismaService) {}
  async fetchAllResponsibleParties(): Promise<ResponsibleParties[]> {
    const responsibles = await this.prisma.responsibleParties.findMany({
      where: {
        status: 'ACTIVE',
      },
      include: {
        customer: true,
      },
    })
    return responsibles.map(PrismaResponsibleMapper.toDomainWithCustomer)
  }

  async fetchBirthdaysOfTheMonth(
    params: PaginationParams,
  ): Promise<ResponsibleParties[]> {
    const today = new Date()
    const month = today.getMonth() + 1

    const responsibles = await this.prisma.responsibleParties.findMany()

    const birthdaysOfTheMonth = responsibles.filter((party) => {
      const birthdate = new Date(party.birthdate)
      return birthdate.getMonth() + 1 === month
    })

    return birthdaysOfTheMonth.map(PrismaResponsibleMapper.toDomain)
  }

  async fetchBirthdaysOfTheDay(): Promise<ResponsibleParties[]> {
    const today = new Date()
    const month = today.getMonth() + 1
    const day = today.getDate()

    const responsibles = await this.prisma.responsibleParties.findMany()

    const birthdaysOfTheDay = responsibles.filter((party) => {
      const birthdate = new Date(party.birthdate)
      return birthdate.getMonth() + 1 === month && birthdate.getDate() === day
    })

    return birthdaysOfTheDay.map(PrismaResponsibleMapper.toDomain)
  }

  async fetchCustomerResponsibleParties(
    customerId: string,
    { page }: PaginationParams,
  ): Promise<ResponsibleParties[]> {
    const responsibleParties = await this.prisma.responsibleParties.findMany({
      where: {
        customerId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 20,
      skip: (page - 1) * 20,
    })

    return responsibleParties.map(PrismaResponsibleMapper.toDomain)
  }

  async findAll({
    page,
    size,
  }: PaginationParams): Promise<ResponsibleParties[]> {
    const amount = size || 20
    const responsible = await this.prisma.responsibleParties.findMany({
      take: amount,
      skip: (page - 1) * amount,
    })
    return responsible.map(PrismaResponsibleMapper.toDomain)
  }

  async findById(id: string): Promise<ResponsibleParties | null> {
    const responsible = await this.prisma.responsibleParties.findUnique({
      where: {
        id,
      },
    })

    if (!responsible) {
      return null
    }

    return PrismaResponsibleMapper.toDomain(responsible)
  }

  async findByEmail(email: string): Promise<ResponsibleParties | null> {
    const responsible = await this.prisma.responsibleParties.findUnique({
      where: {
        email,
      },
    })

    if (!responsible) {
      return null
    }

    return PrismaResponsibleMapper.toDomain(responsible)
  }

  async create(responsible: ResponsibleParties): Promise<ResponsibleParties> {
    const data = PrismaResponsibleMapper.toPrisma(responsible)

    const newResponsible = await this.prisma.responsibleParties.create({
      data,
    })
    return PrismaResponsibleMapper.toDomain(newResponsible)
  }

  async update(
    id: string,
    responsible: ResponsiblePartiesEditProps,
  ): Promise<ResponsibleParties> {
    const responsibleParties = await this.prisma.responsibleParties.update({
      where: {
        id,
      },
      data: {
        firstName: responsible.firstName && responsible.firstName,
        lastName: responsible.lastName && responsible.lastName,
        responsiblePartiesRole:
          responsible.responsiblePartiesRole &&
          responsible.responsiblePartiesRole,
        birthdate: responsible.birthdate,
        email: responsible.email,
        phone: responsible.phone,
      },
    })

    return PrismaResponsibleMapper.toDomain(responsibleParties)
  }

  async fetchByStatus(
    status: Status,
    { page }: PaginationParams,
  ): Promise<ResponsibleParties[]> {
    const responsibles = await this.prisma.responsibleParties.findMany({
      where: {
        status,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 20,
      skip: (page - 1) * 20,
    })

    return responsibles.map(PrismaResponsibleMapper.toDomain)
  }

  async remove(id: string): Promise<void> {
    await this.prisma.responsibleParties.update({
      where: {
        id,
      },
      data: {
        status: 'INACTIVE',
      },
    })
  }
}
