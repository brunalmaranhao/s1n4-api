import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { Customer } from '../../enterprise/entities/customer'
import { CustomerRepository } from '../repositories/customer-repository'
import { CustomerNotFoundError } from './errors/customer-not-found'

interface FetchCustomerUseCaseRequest {
  id: string
}

type FetchCustomerUseCaseResponse = Either<
  CustomerNotFoundError,
  {
    customer: Customer
  }
>

@Injectable()
export class FetchCustomerUseCase {
  constructor(private customerRepository: CustomerRepository) {}

  async execute({
    id,
  }: FetchCustomerUseCaseRequest): Promise<FetchCustomerUseCaseResponse> {
    const customer = await this.customerRepository.findById(id)

    if (!customer) {
      return left(new CustomerNotFoundError())
    }

    return right({
      customer,
    })
  }
}
