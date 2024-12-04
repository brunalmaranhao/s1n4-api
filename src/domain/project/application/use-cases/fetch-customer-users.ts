import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { CustomerRepository } from '../repositories/customer-repository'
import { User } from '../../enterprise/entities/user'
import { CustomerNotFoundError } from './errors/customer-not-found'
import { UserRepository } from '../repositories/user-repository'

interface FetchCustomerUsersUseCaseRequest {
  page: number
  customerId: string
}

type FetchCustomerUsersUseCaseResponse = Either<
  CustomerNotFoundError,
  {
    users: User[]
  }
>

@Injectable()
export class FetchCustomerUsersUseCase {
  constructor(
    private customerRepository: CustomerRepository,
    private userRepository: UserRepository,
  ) {}

  async execute({
    customerId,
    page,
  }: FetchCustomerUsersUseCaseRequest): Promise<FetchCustomerUsersUseCaseResponse> {
    const customer = await this.customerRepository.findById(customerId)

    if (!customer) {
      return left(new CustomerNotFoundError())
    }

    const users = await this.userRepository.fetchCostumerUsers(
      customer.id.toString(),
      {
        page,
      },
    )

    return right({
      users,
    })
  }
}
