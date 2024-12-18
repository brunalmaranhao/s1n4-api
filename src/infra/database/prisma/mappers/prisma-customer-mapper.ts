import {
  Customer as PrismaCustomer,
  Prisma,
  CustomerAddress,
  User as PrismaUser,
  Project as PrismaProject,
} from '@prisma/client'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Customer } from '@/domain/project/enterprise/entities/customer'

type PrismaCustomerProps = PrismaCustomer & {
  address?: CustomerAddress[]
}

type PrismaCustomerWithProjectProps = PrismaCustomer & {
  projects: PrismaProject[]
}

type PrismaCustomerWithUsersProps = PrismaCustomer & {
  users?: PrismaUser[]
}

type PrismaCustomerWithAdressAndUsers = PrismaCustomer & {
  address?: CustomerAddress[]
  users?: PrismaUser[]
}

type PrismaCustomerWithAllFields = PrismaCustomer & {
  address?: CustomerAddress[]
  users?: PrismaUser[]
  projects: PrismaProject[]
}

export class PrismaCustomerMapper {
  static toDomainWithAddress(raw: PrismaCustomerProps): Customer {
    return Customer.create(
      {
        name: raw.name,
        corporateName: raw.corporateName,
        cnpj: raw.cnpj,
        contractDuration: raw.contractDuration,
        contractValue: raw.contractValue,
        paymentMethods: raw.paymentMethods,
        accumulatedInvestment: raw.accumulatedInvestment,
        expenditureProjection: raw.expenditureProjection,
        contractObjective: raw.contractObjective,
        contractedServices: raw.contractedServices,
        status: raw.status,
        createdAt: raw.createdAt,
        address: raw.address,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toDomainWithProjects(raw: PrismaCustomerWithProjectProps): Customer {
    return Customer.create(
      {
        name: raw.name,
        corporateName: raw.corporateName,
        cnpj: raw.cnpj,
        contractDuration: raw.contractDuration,
        contractValue: raw.contractValue,
        paymentMethods: raw.paymentMethods,
        accumulatedInvestment: raw.accumulatedInvestment,
        expenditureProjection: raw.expenditureProjection,
        contractObjective: raw.contractObjective,
        contractedServices: raw.contractedServices,
        status: raw.status,
        createdAt: raw.createdAt,
        projects: raw.projects,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toDomainWithAllFields(raw: PrismaCustomerWithAllFields) {
    return Customer.create(
      {
        name: raw.name,
        corporateName: raw.corporateName,
        cnpj: raw.cnpj,
        contractDuration: raw.contractDuration,
        contractValue: raw.contractValue,
        paymentMethods: raw.paymentMethods,
        accumulatedInvestment: raw.accumulatedInvestment,
        expenditureProjection: raw.expenditureProjection,
        contractObjective: raw.contractObjective,
        contractedServices: raw.contractedServices,
        status: raw.status,
        createdAt: raw.createdAt,
        address: raw.address,
        users: raw.users,
        projects: raw.projects,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toDomainWithAdressAndUsers(
    raw: PrismaCustomerWithAdressAndUsers,
  ): Customer {
    return Customer.create({
      name: raw.name,
      corporateName: raw.corporateName,
      cnpj: raw.cnpj,
      contractDuration: raw.contractDuration,
      contractValue: raw.contractValue,
      paymentMethods: raw.paymentMethods,
      accumulatedInvestment: raw.accumulatedInvestment,
      expenditureProjection: raw.expenditureProjection,
      contractObjective: raw.contractObjective,
      contractedServices: raw.contractedServices,
      status: raw.status,
      createdAt: raw.createdAt,
      address: raw.address,
      users: raw.users,
    })
  }

  static toDomainWithUsers(raw: PrismaCustomerWithUsersProps): Customer {
    return Customer.create(
      {
        name: raw.name,
        corporateName: raw.corporateName,
        cnpj: raw.cnpj,
        contractDuration: raw.contractDuration,
        contractValue: raw.contractValue,
        paymentMethods: raw.paymentMethods,
        accumulatedInvestment: raw.accumulatedInvestment,
        expenditureProjection: raw.expenditureProjection,
        contractObjective: raw.contractObjective,
        contractedServices: raw.contractedServices,
        status: raw.status,
        createdAt: raw.createdAt,
        users: raw.users,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toDomain(raw: PrismaCustomer): Customer {
    return Customer.create(
      {
        name: raw.name,
        corporateName: raw.corporateName,
        cnpj: raw.cnpj,
        contractDuration: raw.contractDuration,
        contractValue: raw.contractValue,
        paymentMethods: raw.paymentMethods,
        accumulatedInvestment: raw.accumulatedInvestment,
        expenditureProjection: raw.expenditureProjection,
        contractObjective: raw.contractObjective,
        contractedServices: raw.contractedServices,
        status: raw.status,
        createdAt: raw.createdAt,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(customer: Customer): Prisma.CustomerUncheckedCreateInput {
    return {
      id: customer.id.toString(),
      name: customer.name,
      corporateName: customer.corporateName,
      cnpj: customer.cnpj,
      createdAt: customer.createdAt || new Date(),
      updatedAt: customer.updatedAt,
      status: customer.status || 'ACTIVE',
      contractDuration: customer.contractDuration,
      contractValue: customer.contractValue,
      paymentMethods: customer.paymentMethods,
      accumulatedInvestment: customer.accumulatedInvestment,
      expenditureProjection: customer.expenditureProjection,
      contractObjective: customer.contractObjective,
      contractedServices: customer.contractedServices,
    }
  }
}
