import { Comment } from '../../enterprise/entities/comment'

export abstract class CommentRepository {
  abstract create(comment: Comment): Promise<Comment>
  abstract findById(commentId: string): Promise<Comment | null>
  abstract update(commentId: string, content: string): Promise<Comment>

  abstract remove(id: string): Promise<void>
}
