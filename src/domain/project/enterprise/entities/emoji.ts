import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export interface EmojiProps {
  unified: string
  name: string
  category: string
  char?: string | null
}

export class Emoji extends Entity<EmojiProps> {
  get char() {
    return this.props.char
  }

  get unified() {
    return this.props.unified
  }

  get name() {
    return this.props.name
  }

  get category() {
    return this.props.category
  }

  static create(props: EmojiProps, id?: UniqueEntityID) {
    const emoji = new Emoji(
      {
        ...props,
      },
      id,
    )
    return emoji
  }
}
