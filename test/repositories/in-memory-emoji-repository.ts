import { EmojiRepository } from '@/domain/project/application/repositories/emoji-repository'
import { Emoji } from '@/domain/project/enterprise/entities/emoji'

export class InMemoryEmojiRepository implements EmojiRepository {
  public items: Emoji[] = []

  async create(emoji: Emoji): Promise<Emoji> {
    this.items.push(emoji)
    return emoji
  }

  async findById(emojiId: string): Promise<Emoji | null> {
    const emoji = this.items.find((item) => item.id.toString() === emojiId)
    return emoji ?? null
  }

  async findByUnified(unified: string): Promise<Emoji | null> {
    const emoji = this.items.find((item) => item.unified === unified)
    return emoji ?? null
  }
}
