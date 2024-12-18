import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { TagRepository } from '../repositories/tag-repository'
import { Tag } from '../../enterprise/entities/tags'

interface FetchTagsByCustomerUseCaseRequest {
  customer: string
}

type FetchTagsByCustomerUseCaseResponse = Either<
  null,
  {
    tags: Tag[]
  }
>

@Injectable()
export class FetchTagsByCustomerUseCase {
  constructor(private tagRepository: TagRepository) {}

  async execute({
    customer,
  }: FetchTagsByCustomerUseCaseRequest): Promise<FetchTagsByCustomerUseCaseResponse> {
    const tags = await this.tagRepository.findByCustomer(customer)

    return right({
      tags,
    })
  }
}
