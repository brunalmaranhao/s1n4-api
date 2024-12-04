import { CustomerRepository } from '@/domain/project/application/repositories/customer-repository'
import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { CustomerNotFoundError } from './errors/customer-not-found'
import { Customer } from '../../enterprise/entities/customer'
import { CustomerEditProps } from '@/core/types/customer-props'

interface UpdateCustomerUseCaseRequest {
  id: string
  customer: CustomerEditProps
}

type UpdateCustomerUseCaseResponse = Either<
  CustomerNotFoundError,
  {
    customer: Customer
  }
>

@Injectable()
export class UpdateCustomerUseCase {
  constructor(private customerRepository: CustomerRepository) {}

  async execute({
    id,
    customer,
  }: UpdateCustomerUseCaseRequest): Promise<UpdateCustomerUseCaseResponse> {
    const existCustomer = await this.customerRepository.findById(id)

    if (!existCustomer) {
      return left(new CustomerNotFoundError())
    }

    const newCustomer = await this.customerRepository.update(id, customer)

    return right({
      customer: newCustomer,
    })
  }
}
