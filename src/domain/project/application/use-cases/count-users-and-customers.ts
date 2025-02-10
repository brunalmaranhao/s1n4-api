import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { CustomerRepository } from '../repositories/customer-repository'
import { UserRepository } from '../repositories/user-repository'

type CountUsersAndCustomersUseCaseResponse = Either<
  null,
  {
    totalUsers: number
    totalCustomers: number
  }
>

@Injectable()
export class CountUsersAndCustomersUseCase {
  constructor(
    private customerRepository: CustomerRepository,
    private userRepository: UserRepository,
  ) {}

  async execute(): Promise<CountUsersAndCustomersUseCaseResponse> {
    const totalCustomers = await this.customerRepository.countActiveCustomers()
    const totalUsers = await this.userRepository.countActiveUsersCustomers()

    return right({
      totalCustomers,
      totalUsers,
    })
  }
}
