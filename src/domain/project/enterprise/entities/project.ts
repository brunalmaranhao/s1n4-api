import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import { Customer as PrismaCustomer, Status } from '@prisma/client'
import { Customer } from './customer'

export interface ProjectProps {
  name: string
  deadline?: Date | null
  status: Status
  customerId: UniqueEntityID
  createdAt: Date
  updatedAt?: Date | null
  customer?: Customer | PrismaCustomer | null
  budget?: number | null
  listProjectsId: UniqueEntityID
  updatedListProjectAt?: Date | null
  shouldShowInformationsToCustomerUser: boolean
}

export class Project extends Entity<ProjectProps> {
  get shouldShowInformationsToCustomerUser() {
    return this.props.shouldShowInformationsToCustomerUser
  }

  get updatedListProjectAt() {
    return this.props.updatedListProjectAt
  }

  get listProjectsId() {
    return this.props.listProjectsId
  }

  set listProjectsId(listProjectsId) {
    this.props.listProjectsId = listProjectsId
  }

  get customer() {
    return this.props.customer
  }

  get budget() {
    return this.props.budget
  }

  get customerId() {
    return this.props.customerId
  }

  set customerId(customerId) {
    this.props.customerId = customerId
  }

  get name() {
    return this.props.name
  }

  set name(name: string) {
    this.props.name = name
  }

  get deadline(): Date | null | undefined {
    return this.props.deadline
  }

  set deadline(deadline: Date | null) {
    this.props.deadline = deadline
  }

  get status() {
    return this.props.status
  }

  set status(status: Status) {
    this.props.status = status
  }

  get updatedAt(): Date | null | undefined {
    return this.props.updatedAt
  }

  set updatedAt(updatedAt: Date) {
    this.props.updatedAt = updatedAt
  }

  get createdAt() {
    return this.props.createdAt
  }

  static create(
    props: Optional<
      ProjectProps,
      'createdAt' | 'status' | 'budget' | 'shouldShowInformationsToCustomerUser'
    >,
    id?: UniqueEntityID,
  ) {
    const project = new Project(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
        status: props.status ?? 'ACTIVE',
        budget: props.budget ?? 0,
        shouldShowInformationsToCustomerUser:
          props.shouldShowInformationsToCustomerUser ?? true,
      },
      id,
    )

    return project
  }
}
