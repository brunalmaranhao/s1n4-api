import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import { Status } from '@prisma/client'

export interface DepartmentProps {
  name: string
  description?: string | null
  createdAt: Date
  updatedAt?: Date | null
  status: Status
}

export class Department extends Entity<DepartmentProps> {
  get status() {
    return this.props.status
  }

  get name() {
    return this.props.name
  }

  get description() {
    return this.props.description
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  static create(
    props: Optional<DepartmentProps, 'createdAt' | 'status'>,
    id?: UniqueEntityID,
  ) {
    const department = new Department(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
        status: props.status ?? 'ACTIVE',
      },
      id,
    )

    return department
  }
}
