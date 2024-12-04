import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import { HistoryLogAction } from '@prisma/client'

export interface HistoryLogProps {
  userId: UniqueEntityID
  projectId?: UniqueEntityID | null
  reportId?: UniqueEntityID | null
  action: HistoryLogAction
  createdAt: Date
  updatedAt?: Date | null
}

export class HistoryLog extends Entity<HistoryLogProps> {
  get reportId() {
    return this.props.reportId
  }

  get userId() {
    return this.props.userId
  }

  get projectId() {
    return this.props.projectId
  }

  get action() {
    return this.props.action
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  get createdAt() {
    return this.props.createdAt
  }

  static create(
    props: Optional<HistoryLogProps, 'createdAt'>,
    id?: UniqueEntityID,
  ) {
    const log = new HistoryLog(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )

    return log
  }
}
