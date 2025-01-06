import { ReactionRepository } from '@/domain/project/application/repositories/reaction-repository'
import { Reaction } from '@/domain/project/enterprise/entities/reaction'

export class InMemoryReactionRepository implements ReactionRepository {
  public items: Reaction[] = []

  async findByProjectUpdateId(projectUpdateId: string): Promise<Reaction[]> {
    const reactions = this.items.filter(
      (reaction) => reaction.projectUpdateId?.toString() === projectUpdateId,
    )
    return reactions
  }

  async findByProjectUpdateAndUser(
    projectUpdateId: string,
    userId: string,
  ): Promise<Reaction | null> {
    const reactions = this.items.find(
      (reaction) =>
        reaction.projectUpdateId?.toString() === projectUpdateId &&
        reaction.userId.toString() === userId,
    )
    if (!reactions) return null
    return reactions
  }

  async findByCommentAndUser(
    commentId: string,
    userId: string,
  ): Promise<Reaction | null> {
    const reactions = this.items.find(
      (reaction) =>
        reaction.commentId?.toString() === commentId &&
        reaction.userId.toString() === userId,
    )
    if (!reactions) return null
    return reactions
  }

  async create(reaction: Reaction): Promise<Reaction> {
    this.items.push(reaction)
    return reaction
  }

  async findById(reactionId: string): Promise<Reaction | null> {
    const reaction = this.items.find(
      (item) => item.id.toString() === reactionId,
    )
    return reaction ?? null
  }

  async remove(id: string): Promise<void> {
    const reactionIndex = this.items.filter((item) => item.id.toString() !== id)

    this.items = reactionIndex
  }
}
