import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import { ResponsiblePartiesRole, Status } from '@prisma/client'

export interface ResponsiblePartiesProps {
  firstName: string
  lastName: string
  email: string
  phone: string
  birthdate: Date
  status: Status
  createdAt: Date
  updatedAt?: Date | null
  customerId: UniqueEntityID
  responsiblePartiesRole: ResponsiblePartiesRole[]
}

export class ResponsibleParties extends Entity<ResponsiblePartiesProps> {
  get responsiblePartiesRole() {
    return this.props.responsiblePartiesRole
  }

  set responsiblePartiesRole(roles: ResponsiblePartiesRole[]) {
    this.props.responsiblePartiesRole = roles
  }

  get customerId() {
    return this.props.customerId
  }

  get firstName() {
    return this.props.firstName
  }

  get lastName() {
    return this.props.lastName
  }

  get phone() {
    return this.props.phone
  }

  get email() {
    return this.props.email
  }

  get birthdate() {
    return this.props.birthdate
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  get createdAt() {
    return this.props.createdAt
  }

  get status() {
    return this.props.status
  }

  set status(status) {
    this.props.status = status
  }

  static create(
    props: Optional<ResponsiblePartiesProps, 'createdAt' | 'status'>,
    id?: UniqueEntityID,
  ) {
    const responsible = new ResponsibleParties(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
        status: props.status ?? 'ACTIVE',
      },
      id,
    )

    return responsible
  }
}
