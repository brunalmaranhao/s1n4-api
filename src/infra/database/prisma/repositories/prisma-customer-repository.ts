import { Status } from '@prisma/client'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { CustomerRepository } from '@/domain/project/application/repositories/customer-repository'
import { Customer } from '@/domain/project/enterprise/entities/customer'
import { PrismaCustomerMapper } from '../mappers/prisma-customer-mapper'
import { CustomerEditProps } from '@/core/types/customer-props'

@Injectable()
export class PrismaCustomersRepository implements CustomerRepository {
  constructor(private prisma: PrismaService) {}

  async getCustomersWithUsers({
    page,
    size,
  }: PaginationParams): Promise<Customer[]> {
    const amount = size || 10
    const customers = await this.prisma.customer.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        users: true,
      },
      take: amount,
      skip: (page - 1) * amount,
    })

    return customers.map(PrismaCustomerMapper.toDomainWithUsers)
  }

  async findByName(name: string): Promise<Customer | null> {
    const customer = await this.prisma.customer.findUnique({
      where: {
        name,
      },
    })

    if (!customer) {
      return null
    }

    return PrismaCustomerMapper.toDomain(customer)
  }

  async findByCorporateName(corporateName: string): Promise<Customer | null> {
    const customer = await this.prisma.customer.findUnique({
      where: {
        corporateName,
      },
    })

    if (!customer) {
      return null
    }

    return PrismaCustomerMapper.toDomain(customer)
  }

  async findByCnpj(cnpj: string): Promise<Customer | null> {
    const customer = await this.prisma.customer.findUnique({
      where: {
        cnpj,
      },
    })

    if (!customer) {
      return null
    }

    return PrismaCustomerMapper.toDomain(customer)
  }

  async remove(id: string): Promise<void> {
    await this.prisma.$transaction(async (prisma) => {
      await prisma.customer.update({
        where: { id },
        data: { status: 'INACTIVE' },
      })

      await prisma.responsibleParties.updateMany({
        where: { customerId: id },
        data: { status: 'INACTIVE' },
      })

      await prisma.project.updateMany({
        where: { customerId: id },
        data: { status: 'INACTIVE' },
      })

      await prisma.user.updateMany({
        where: { customerId: id },
        data: { status: 'INACTIVE' },
      })

      await prisma.report.updateMany({
        where: { customerId: id },
        data: { status: 'INACTIVE' },
      })
    })
  }

  async findById(id: string): Promise<Customer | null> {
    const customer = await this.prisma.customer.findUnique({
      where: {
        id,
      },
      include: {
        projects: true,
      },
    })

    if (!customer) {
      return null
    }

    return PrismaCustomerMapper.toDomainWithAllFields(customer)
  }

  async update(
    customerId: string,
    customer: CustomerEditProps,
  ): Promise<Customer> {
    const newCustomer = await this.prisma.customer.update({
      where: {
        id: customerId,
      },
      data: customer,
    })

    return PrismaCustomerMapper.toDomain(newCustomer)
  }

  async findAll({ page, size }: PaginationParams): Promise<Customer[]> {
    const amount = size || 20
    const customers = await this.prisma.customer.findMany({
      take: amount,
      skip: (page - 1) * amount,
    })
    return customers.map(PrismaCustomerMapper.toDomain)
  }

  async create(customer: Customer): Promise<Customer> {
    const data = PrismaCustomerMapper.toPrisma(customer)

    const newCustomer = await this.prisma.customer.create({
      data,
    })
    return PrismaCustomerMapper.toDomain(newCustomer)
  }

  async countActiveCustomers(): Promise<number> {
    const totalActiveCustomers = await this.prisma.customer.count({
      where: {
        status: 'ACTIVE',
      },
    })

    return totalActiveCustomers
  }

  async fetchByStatus(
    status: Status,
    { page, size }: PaginationParams,
  ): Promise<{ customers: Customer[]; total: number }> {
    const amount = size || 10
    const [customers, total] = await this.prisma.$transaction([
      this.prisma.customer.findMany({
        where: {
          status,
        },
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          address: true,
          users: true,
          projects: true,
        },
        take: amount,
        skip: (page - 1) * amount,
      }),
      this.prisma.customer.count({
        where: {
          status,
        },
      }),
    ])

    return {
      customers: customers.map(PrismaCustomerMapper.toDomainWithAllFields),
      total,
    }
  }

  s

  async fetchByStatusWithoutPagination(
    status: Status,
  ): Promise<{ customers: Customer[]; total: number }> {
    const [customers, total] = await this.prisma.$transaction([
      this.prisma.customer.findMany({
        where: {
          status,
        },
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          address: true,
          projects: true,
          users: true,
        },
      }),
      this.prisma.customer.count({
        where: {
          status,
        },
      }),
    ])

    return {
      customers: customers.map(PrismaCustomerMapper.toDomainWithProjects),
      total,
    }
  }
}
