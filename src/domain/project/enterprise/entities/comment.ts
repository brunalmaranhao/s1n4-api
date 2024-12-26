import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import {
  Status,
  ProjectUpdates as PrismaProjectUpdates,
  User as PrismaUser,
} from '@prisma/client'
import { ProjectUpdate } from './projectUpdates'
import { User } from './user'

export interface CommentProps {
  content: string
  createdAt: Date
  updatedAt?: Date | null
  status: Status
  projectUpdateId: UniqueEntityID
  authorId: UniqueEntityID
  projectUpdate?: ProjectUpdate | PrismaProjectUpdates | null
  user?: User | PrismaUser | null
}

export class Comment extends Entity<CommentProps> {
  get content() {
    return this.props.content
  }

  set content(content) {
    this.props.content = content
  }

  get authorId() {
    return this.props.authorId
  }

  get user() {
    return this.props.user
  }

  get projectUpdate() {
    return this.props.projectUpdate
  }

  get projectUpdateId() {
    return this.props.projectUpdateId
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
    props: Optional<CommentProps, 'createdAt' | 'status'>,
    id?: UniqueEntityID,
  ) {
    const comment = new Comment(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
        status: props.status ?? 'ACTIVE',
      },
      id,
    )

    return comment
  }
}
