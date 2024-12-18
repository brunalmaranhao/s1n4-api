import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import { Status } from '@prisma/client'

export interface TagProps {
  name: string
  color: string
  status: Status
  customerId: UniqueEntityID
  createdAt: Date
  updatedAt?: Date | null
}

export class Tag extends Entity<TagProps> {
  get customerId() {
    return this.props.customerId
  }

  get color() {
    return this.props.color
  }

  set color(color: string) {
    this.props.color = color
  }

  get name() {
    return this.props.name
  }

  set name(name: string) {
    this.props.name = name
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
    props: Optional<TagProps, 'createdAt' | 'status'>,
    id?: UniqueEntityID,
  ) {
    const tag = new Tag(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
        status: props.status ?? 'ACTIVE',
      },
      id,
    )

    return tag
  }
}
