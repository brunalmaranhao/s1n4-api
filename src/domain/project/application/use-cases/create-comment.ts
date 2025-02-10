import { Either, left, right } from '@/core/either'
import { ForbiddenException, Injectable } from '@nestjs/common'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { CommentRepository } from '../repositories/comment-repository'
import { Comment } from '../../enterprise/entities/comment'
import { ProjectUpdateRepository } from '../repositories/project-update-repository'
import { UserRepository } from '../repositories/user-repository'
import { ProjectUpdatesNotFoundError } from './errors/project-updates-not-found-error'
import { UserNotFoundError } from './errors/user-not-found-error'

interface CreateCommentUseCaseRequest {
  content: string
  authorId: string
  projectUpdateId: string
}

type CreateCommentUseCaseResponse = Either<
  ForbiddenException | ProjectUpdatesNotFoundError | UserNotFoundError,
  {
    comment: Comment
  }
>

@Injectable()
export class CreateCommentUseCase {
  constructor(
    private commentRepository: CommentRepository,
    private projectUpdateRepository: ProjectUpdateRepository,
    private userRepository: UserRepository,
  ) {}

  async execute({
    content,
    authorId,
    projectUpdateId,
  }: CreateCommentUseCaseRequest): Promise<CreateCommentUseCaseResponse> {
    const projectUpdate =
      await this.projectUpdateRepository.findById(projectUpdateId)

    if (!projectUpdate) {
      return left(new ProjectUpdatesNotFoundError())
    }
    const user = await this.userRepository.findById(authorId)

    if (!user) {
      return left(new UserNotFoundError())
    }
    if (
      (user?.role === 'CLIENT_OWNER' ||
        user?.role === 'CLIENT_RESPONSIBLE' ||
        user?.role === 'CLIENT_USER') &&
      user.customerId?.toString() !==
        projectUpdate?.project?.customerId.toString()
    ) {
      return left(new ForbiddenException('Acesso negado.'))
    }
    const newComment = Comment.create({
      content,
      authorId: new UniqueEntityID(authorId),
      projectUpdateId: new UniqueEntityID(projectUpdateId),
    })

    const comment = await this.commentRepository.create(newComment)

    return right({
      comment,
    })
  }
}
