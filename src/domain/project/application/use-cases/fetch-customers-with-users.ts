import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { CustomerRepository } from '../repositories/customer-repository'
import { Customer } from '../../enterprise/entities/customer'

interface FetchCustomersWithUsersUseCaseRequest {
  page: number
  size: number
}

type FetchCustomersWithUsersUseCaseResponse = Either<
  null,
  {
    customersWithUsers: Customer[]
  }
>

@Injectable()
export class FetchCustomersWithUsersUseCase {
  constructor(private customerRepository: CustomerRepository) {}

  async execute({
    page,
    size,
  }: FetchCustomersWithUsersUseCaseRequest): Promise<FetchCustomersWithUsersUseCaseResponse> {
    const customersWithUsers =
      await this.customerRepository.getCustomersWithUsers({
        size,
        page,
      })

    return right({
      customersWithUsers,
    })
  }
}
