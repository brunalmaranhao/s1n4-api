import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { CustomerNotFoundError } from './errors/customer-not-found'
import { CustomerRepository } from '../repositories/customer-repository'

interface RemoveCustomerUseCaseRequest {
  id: string
}

type RemoveCustomerUseCaseResponse = Either<CustomerNotFoundError, null>

@Injectable()
export class RemoveCustomerUseCase {
  constructor(private customerRepository: CustomerRepository) {}

  async execute({
    id,
  }: RemoveCustomerUseCaseRequest): Promise<RemoveCustomerUseCaseResponse> {
    const customer = await this.customerRepository.findById(id)

    if (!customer) {
      return left(new CustomerNotFoundError())
    }

    await this.customerRepository.remove(id)

    return right(null)
  }
}
