import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { UserRepository } from '@/domain/project/application/repositories/user-repository'
import { User } from '@/domain/project/enterprise/entities/user'
import { PrismaUserMapper } from '../mappers/prisma-user-mapper'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { Status } from '@prisma/client'
import { UserEditProps } from '@/core/types/user-props'

@Injectable()
export class PrismaUsersRepository implements UserRepository {
  constructor(private prisma: PrismaService) {}

  async fetchUsersAdmin(): Promise<User[]> {
    const users = await this.prisma.user.findMany({
      where: {
        role: {
          in: [
            'INTERNAL_FINANCIAL_LEGAL',
            'INTERNAL_MANAGEMENT',
            'INTERNAL_PARTNERS',
          ],
        },
      },
    })

    return users.map(PrismaUserMapper.toDomain)
  }

  async fetchCostumerUsers(
    customerId: string,
    { page }: PaginationParams,
  ): Promise<User[]> {
    const users = await this.prisma.user.findMany({
      where: {
        customerId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 20,
      skip: (page - 1) * 20,
    })

    return users.map(PrismaUserMapper.toDomain)
  }

  async findAll({ page, size }: PaginationParams): Promise<User[]> {
    const amount = size || 20
    const users = await this.prisma.user.findMany({
      take: amount,
      skip: (page - 1) * amount,
    })
    return users.map(PrismaUserMapper.toDomain)
  }

  async updatePassword(id: string, newPassword: string): Promise<User> {
    const user = await this.prisma.user.update({
      where: {
        id,
      },
      data: {
        password: newPassword,
      },
    })

    return PrismaUserMapper.toDomain(user)
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
      include: {
        customer: true,
      },
    })

    if (!user) {
      return null
    }

    return PrismaUserMapper.toDomainWithCustomer(user)
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (!user) {
      return null
    }

    return PrismaUserMapper.toDomain(user)
  }

  async create(user: User): Promise<User> {
    const data = PrismaUserMapper.toPrisma(user)

    const newUser = await this.prisma.user.create({
      data,
    })
    return PrismaUserMapper.toDomain(newUser)
  }

  async update(userId: string, user: UserEditProps): Promise<User> {
    const newUser = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        firstName: user.firstName && user.firstName,
        lastName: user.lastName && user.lastName,
        role: user.role && user.role,
      },
    })

    return PrismaUserMapper.toDomain(newUser)
  }

  async fetchByStatus(
    status: Status,
    { page }: PaginationParams,
  ): Promise<User[]> {
    const customers = await this.prisma.user.findMany({
      where: {
        status,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 20,
      skip: (page - 1) * 20,
    })

    return customers.map(PrismaUserMapper.toDomain)
  }

  async remove(id: string): Promise<void> {
    await this.prisma.user.update({
      where: {
        id,
      },
      data: {
        status: 'INACTIVE',
      },
    })
  }

  async countActiveUsersCustomers(): Promise<number> {
    const activeUsersCount = await this.prisma.user.count({
      where: {
        status: 'ACTIVE',
        customerId: { not: null },
      },
    })

    return activeUsersCount
  }
}
