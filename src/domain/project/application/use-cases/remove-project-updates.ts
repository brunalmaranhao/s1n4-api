import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { ProjectUpdateRepository } from '../repositories/project-update-repository'
import { ProjectUpdatesNotFoundError } from './errors/project-updates-not-found-error'
import { CommentRepository } from '../repositories/comment-repository'

interface RemoveProjectUpdatesUseCaseRequest {
  id: string
}

type RemoveProjectUpdatesUseCaseResponse = Either<
  ProjectUpdatesNotFoundError,
  null
>

@Injectable()
export class RemoveProjectUpdatesUseCase {
  constructor(
    private projectUpdateRepository: ProjectUpdateRepository,
    private commentRepository: CommentRepository,
  ) {}

  async execute({
    id,
  }: RemoveProjectUpdatesUseCaseRequest): Promise<RemoveProjectUpdatesUseCaseResponse> {
    const project = await this.projectUpdateRepository.findById(id)

    if (!project) {
      return left(new ProjectUpdatesNotFoundError())
    }

    await this.projectUpdateRepository.remove(id)

    project.comments?.map(async (comment) => {
      await this.commentRepository.remove(comment.id)
    })

    return right(null)
  }
}
