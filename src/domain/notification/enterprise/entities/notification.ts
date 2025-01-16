import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import { ProjectUpdates, Project as PrismaProject } from '@prisma/client'

export type ProjectUpdatesProps = ProjectUpdates & {
  project?: PrismaProject | null
}
export interface NotificationProps {
  recipientId: UniqueEntityID
  title: string
  content: string
  readAt?: Date | null
  createdAt: Date
  projectUpdateId?: UniqueEntityID | null
  projectUpdates?: ProjectUpdatesProps | null
}

export class Notification extends Entity<NotificationProps> {
  get projectUpdates() {
    return this.props.projectUpdates
  }

  get recipientId() {
    return this.props.recipientId
  }

  get projectUpdateId() {
    return this.props.projectUpdateId
  }

  get title() {
    return this.props.title
  }

  get content() {
    return this.props.content
  }

  get readAt() {
    return this.props.readAt
  }

  get createdAt() {
    return this.props.createdAt
  }

  read() {
    this.props.readAt = new Date()
  }

  static create(
    props: Optional<NotificationProps, 'createdAt'>,
    id?: UniqueEntityID,
  ) {
    const notification = new Notification(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )

    return notification
  }
}
