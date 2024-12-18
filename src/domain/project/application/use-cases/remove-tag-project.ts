import { Either, left, right } from '@/core/either'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ProjectRepository } from '../repositories/project-repository'
import { ProjectNotFoundError } from './errors/project-not-found-error'
import { TagRepository } from '../repositories/tag-repository'
import { TagNotFoundError } from './errors/tag-not-found-error'

interface RemoveTagFromProjectUseCaseRequest {
  projectId: string
  tagId: string
}

type RemoveTagFromProjectUseCaseResponse = Either<
  ProjectNotFoundError | TagNotFoundError | UnauthorizedException,
  null
>

@Injectable()
export class RemoveTagFromProjectUseCase {
  constructor(
    private projectRepository: ProjectRepository,
    private tagRepository: TagRepository,
  ) {}

  async execute({
    projectId,
    tagId,
  }: RemoveTagFromProjectUseCaseRequest): Promise<RemoveTagFromProjectUseCaseResponse> {
    const tag = await this.tagRepository.findById(tagId)

    if (!tag) return left(new TagNotFoundError())

    const project = await this.projectRepository.findById(projectId)
    if (!project) return left(new ProjectNotFoundError())

    if (project.customerId.toString() !== tag.customerId.toString()) {
      return left(new UnauthorizedException())
    }

    await this.projectRepository.removeTagFromProject(projectId, tagId)

    return right(null)
  }
}
