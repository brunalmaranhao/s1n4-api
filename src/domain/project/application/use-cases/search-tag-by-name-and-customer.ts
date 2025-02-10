import { Either, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { ProjectRepository } from '../repositories/project-repository'
import { Tag } from '../../enterprise/entities/tags'
import { TagRepository } from '../repositories/tag-repository'

interface SearchTagByNameAndCustomerUseCaseRequest {
  name: string
  customerId: string
}

type SearchTagByNameAndCustomerUseCaseResponse = Either<
  null,
  {
    tags: Tag[]
  }
>

@Injectable()
export class SearchTagByNameAndCustomerUseCase {
  constructor(private tagRepository: TagRepository) {}

  async execute({
    name,
    customerId,
  }: SearchTagByNameAndCustomerUseCaseRequest): Promise<SearchTagByNameAndCustomerUseCaseResponse> {
    const response = await this.tagRepository.searchByNameAndCustomer(
      name,
      customerId,
    )

    return right({
      tags: response,
    })
  }
}
