import { Emoji } from '../../enterprise/entities/emoji'

export abstract class EmojiRepository {
  abstract findById(id: string): Promise<Emoji | null>

  abstract create(Emoji: Emoji): Promise<Emoji>

  abstract findByUnified(unified: string): Promise<Emoji | null>
}
