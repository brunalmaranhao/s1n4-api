import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { TagRepository } from '../repositories/tag-repository'
import { TagNotFoundError } from './errors/tag-not-found-error'

interface RemoveTagUseCaseRequest {
  id: string
}

type RemoveTagUseCaseResponse = Either<TagNotFoundError, null>

@Injectable()
export class RemoveTagUseCase {
  constructor(private tagRepository: TagRepository) {}

  async execute({
    id,
  }: RemoveTagUseCaseRequest): Promise<RemoveTagUseCaseResponse> {
    const tag = await this.tagRepository.findById(id)

    if (!tag) {
      return left(new TagNotFoundError())
    }

    await this.tagRepository.remove(id)

    return right(null)
  }
}
