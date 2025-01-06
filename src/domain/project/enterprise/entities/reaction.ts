import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import { Status } from '@prisma/client'
import { User } from './user'

export interface ReactionProps {
  userId: UniqueEntityID
  emojiId: UniqueEntityID
  commentId?: UniqueEntityID | null
  projectUpdateId?: UniqueEntityID | null
  emoji?: {
    unified: string
  }
  user?: User
  createdAt: Date
  updatedAt?: Date | null
  status: Status
}

export class Reaction extends Entity<ReactionProps> {
  get updatedAt() {
    return this.props.updatedAt
  }

  get createdAt() {
    return this.props.createdAt
  }

  get projectUpdateId() {
    return this.props.projectUpdateId
  }

  get userId() {
    return this.props.userId
  }

  get emojiId() {
    return this.props.emojiId
  }

  get commentId() {
    return this.props.commentId
  }

  get status() {
    return this.props.status
  }

  get emoji() {
    return this.props.emoji
  }

  get user() {
    return this.props.user
  }

  static create(
    props: Optional<ReactionProps, 'status' | 'createdAt'>,
    id?: UniqueEntityID,
  ) {
    const reaction = new Reaction(
      {
        ...props,
        status: props.status ?? 'ACTIVE',
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )
    return reaction
  }
}
