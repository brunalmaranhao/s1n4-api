import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { TagNotFoundError } from './errors/tag-not-found-error'
import { Tag } from '../../enterprise/entities/tags'
import { TagRepository } from '../repositories/tag-repository'

interface FetchTagByIdUseCaseRequest {
  id: string
}

type FetchTagByIdUseCaseResponse = Either<
  TagNotFoundError,
  {
    tag: Tag
  }
>

@Injectable()
export class FetchTagByIdUseCase {
  constructor(private tagRepository: TagRepository) {}

  async execute({
    id,
  }: FetchTagByIdUseCaseRequest): Promise<FetchTagByIdUseCaseResponse> {
    const tag = await this.tagRepository.findById(id)

    if (!tag) {
      return left(new TagNotFoundError())
    }

    return right({
      tag,
    })
  }
}
