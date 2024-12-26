import { DomainEvents } from '@/core/events/domain-events'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { CommentRepository } from '@/domain/project/application/repositories/comment-repository'
import { Comment } from '@/domain/project/enterprise/entities/comment'

export class InMemoryCommentRepository implements CommentRepository {
  public items: Comment[] = []

  async create(comment: Comment): Promise<Comment> {
    this.items.push(comment)

    DomainEvents.dispatchEventsForAggregate(comment.id)
    return comment
  }

  async findById(commentId: string): Promise<Comment | null> {
    const comment = this.items.find((item) => item.id.toString() === commentId)

    if (!comment) {
      return null
    }

    return comment
  }

  async update(id: string, content: string): Promise<Comment> {
    const projectIndex = this.items.findIndex(
      (item) => item.id.toString() === id,
    )

    const existingProject = this.items[projectIndex]

    existingProject.content = content

    return existingProject
  }

  async remove(id: string): Promise<void> {
    const commentIndex = this.items.findIndex(
      (item) => item.id.toString() === id,
    )
    this.items[commentIndex].status = 'INACTIVE'
  }
}
