import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { EditTagProps, TagRepository } from '../repositories/tag-repository'
import { TagNotFoundError } from './errors/tag-not-found-error'
import { Tag } from '../../enterprise/entities/tags'

interface UpdateTagUseCaseRequest {
  id: string
  tag: EditTagProps
}

type UpdateTagUseCaseResponse = Either<
  TagNotFoundError,
  {
    tag: Tag
  }
>

@Injectable()
export class UpdateTagUseCase {
  constructor(private tagRepository: TagRepository) {}

  async execute({
    id,
    tag,
  }: UpdateTagUseCaseRequest): Promise<UpdateTagUseCaseResponse> {
    const tagExists = await this.tagRepository.findById(id)

    if (!tagExists) {
      return left(new TagNotFoundError())
    }

    const updatedTag = await this.tagRepository.update(id, tag)

    return right({
      tag: updatedTag,
    })
  }
}
