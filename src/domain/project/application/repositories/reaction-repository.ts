import { Reaction } from '../../enterprise/entities/reaction'

export abstract class ReactionRepository {
  abstract findById(id: string): Promise<Reaction | null>

  abstract create(reaction: Reaction): Promise<Reaction>

  abstract findByProjectUpdateId(projectUpdateId: string): Promise<Reaction[]>

  abstract remove(id: string): Promise<void>

  abstract findByProjectUpdateAndUser(
    projectUpdateId: string,
    userId: string,
  ): Promise<Reaction | null>

  abstract findByCommentAndUser(
    commentId: string,
    userId: string,
  ): Promise<Reaction | null>
}
