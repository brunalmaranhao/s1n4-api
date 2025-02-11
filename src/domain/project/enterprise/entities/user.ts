import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import { Customer } from './customer'
import {
  Status,
  UserRoles,
  Customer as PrismaCustomer,
  Department as PrismaDepartment,
} from '@prisma/client'

export interface UserProps {
  firstName: string
  lastName: string
  email: string
  password: string
  createdAt: Date
  updatedAt?: Date | null
  role: UserRoles
  status: Status
  customerId?: UniqueEntityID | null
  customer?: Customer | PrismaCustomer | null
  department?: PrismaDepartment | null
  departmentId?: UniqueEntityID | null
}

export class User extends Entity<UserProps> {
  get departmentId() {
    return this.props.departmentId ?? null
  }

  set departmentId(departmentId: UniqueEntityID | null) {
    this.props.departmentId = departmentId
  }

  get department() {
    return this.props.department
  }

  get customer() {
    return this.props.customer
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

  get password() {
    return this.props.password
  }

  set password(password: string) {
    this.props.password = password
  }

  get email() {
    return this.props.email
  }

  get role() {
    return this.props.role
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
    props: Optional<UserProps, 'createdAt' | 'status'>,
    id?: UniqueEntityID,
  ) {
    const user = new User(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
        status: props.status ?? 'ACTIVE',
      },
      id,
    )

    return user
  }
}
