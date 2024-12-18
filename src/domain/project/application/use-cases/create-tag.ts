import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Tag } from '../../enterprise/entities/tags'
import { TagRepository } from '../repositories/tag-repository'
import { TagAlreadyExistsError } from './errors/tag-already-exists'

interface CreateTagUseCaseRequest {
  name: string
  customerId: string
  color: string
}

type CreateTagUseCaseResponse = Either<
  TagAlreadyExistsError,
  {
    tag: Tag
  }
>

@Injectable()
export class CreateTagUseCase {
  constructor(private tagRepository: TagRepository) {}

  async execute({
    name,
    customerId,
    color,
  }: CreateTagUseCaseRequest): Promise<CreateTagUseCaseResponse> {
    const tagAlreadyExists = await this.tagRepository.findByNameAndCustomer(
      name,
      customerId,
    )

    if (tagAlreadyExists) {
      return left(new TagAlreadyExistsError())
    }

    const newTag = Tag.create({
      name,
      customerId: new UniqueEntityID(customerId),
      color,
    })

    const tag = await this.tagRepository.create(newTag)

    return right({
      tag,
    })
  }
}
