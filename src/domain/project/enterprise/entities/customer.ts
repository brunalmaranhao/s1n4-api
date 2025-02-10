import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import {
  PaymentMethod,
  Status,
  User as PrismaUser,
  CustomerAddress as PrismaCustomerAddress,
  Project as PrismaProject,
  ResponsibleParties as PrismaResponsibleParties,
} from '@prisma/client'
import { CustomerAddress } from './customerAddress'
import { User } from './user'
import { Project } from './project'
import { ResponsibleParties } from './responsibleParties'

export interface CustomerProps {
  name: string
  corporateName: string
  cnpj: string
  contractDuration?: string | null
  contractValue?: number | null
  paymentMethods?: PaymentMethod | null
  accumulatedInvestment?: number | null
  expenditureProjection?: number | null
  contractObjective?: string | null
  contractedServices?: string | null
  status?: Status
  createdAt?: Date
  updatedAt?: Date | null
  address?: CustomerAddress[] | PrismaCustomerAddress[] | null
  users?: User[] | PrismaUser[]
  projects?: Project[] | PrismaProject[]
  responsibleParties?: ResponsibleParties[] | PrismaResponsibleParties[]
}

export class Customer extends Entity<CustomerProps> {
  get responsibleParties() {
    return this.props.responsibleParties
  }

  get address() {
    return this.props.address
  }

  get name() {
    return this.props.name
  }

  get corporateName() {
    return this.props.corporateName
  }

  get cnpj() {
    return this.props.cnpj
  }

  get contractDuration() {
    return this.props.contractDuration
  }

  get expenditureProjection() {
    return this.props.expenditureProjection
  }

  get contractObjective() {
    return this.props.contractObjective
  }

  get contractedServices() {
    return this.props.contractedServices
  }

  get contractValue() {
    return this.props.contractValue
  }

  get paymentMethods() {
    return this.props.paymentMethods
  }

  get accumulatedInvestment() {
    return this.props.accumulatedInvestment
  }

  get status() {
    return this.props.status
  }

  set status(status) {
    this.props.status = status
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  get users() {
    return this.props.users
  }

  get projects() {
    return this.props.projects
  }

  static create(
    props: Optional<
      CustomerProps,
      'createdAt' | 'status' | 'users' | 'projects'
    >,
    id?: UniqueEntityID,
  ) {
    const customer = new Customer(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
        status: props.status ?? 'ACTIVE',
        users: props.users ?? [],
        projects: props.projects ?? [],
      },
      id,
    )

    return customer
  }
}
