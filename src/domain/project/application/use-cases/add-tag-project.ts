import { Either, left, right } from '@/core/either'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ProjectRepository } from '../repositories/project-repository'
import { ProjectNotFoundError } from './errors/project-not-found-error'
import { Tag } from '../../enterprise/entities/tags'

interface AddTagToProjectUseCaseRequest {
  projectId: string
  tag: Tag
}

type AddTagToProjectUseCaseResponse = Either<
  ProjectNotFoundError | UnauthorizedException,
  null
>

@Injectable()
export class AddTagToProjectUseCase {
  constructor(private projectRepository: ProjectRepository) {}

  async execute({
    projectId,
    tag,
  }: AddTagToProjectUseCaseRequest): Promise<AddTagToProjectUseCaseResponse> {
    const project = await this.projectRepository.findById(projectId)
    if (!project) return left(new ProjectNotFoundError())

    if (project.customerId.toString() !== tag.customerId.toString()) {
      return left(new UnauthorizedException())
    }

    const filteredTag = project.tags?.find(
      (item) => item.id.toString() === tag.id.toString(),
    )
    if (filteredTag) {
      return left(
        new UnauthorizedException(
          `Tag ${tag.name} já existe no projeto ${project.name}`,
        ),
      )
    }

    await this.projectRepository.addTagToProject(projectId, tag)

    return right(null)
  }
}
