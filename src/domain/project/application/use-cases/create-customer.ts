import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { CustomerRepository } from '../repositories/customer-repository'
import { Customer, CustomerProps } from '../../enterprise/entities/customer'
import { ExistCustomerSameCnpjError } from './errors/exist-customer-same-cnpj-error'
import { ExistCustomerSameCorporateNameError } from './errors/exist-customer-same-corporate-name-error'
import { ExistCustomerSameNameError } from './errors/exist-customer-same-name-error'

interface CreateCustomerUseCaseRequest {
  customer: CustomerProps
}

type CreateCustomerUseCaseResponse = Either<
  | ExistCustomerSameCnpjError
  | ExistCustomerSameCorporateNameError
  | ExistCustomerSameCorporateNameError,
  {
    customer: Customer
  }
>

@Injectable()
export class CreateCustomerUseCase {
  constructor(private customerRepository: CustomerRepository) {}

  async execute({
    customer,
  }: CreateCustomerUseCaseRequest): Promise<CreateCustomerUseCaseResponse> {
    const existCustomerSameCnpj = await this.customerRepository.findByCnpj(
      customer.cnpj,
    )

    const existCustomerSameName = await this.customerRepository.findByName(
      customer.name,
    )

    const existCustomerSameCorporateName =
      await this.customerRepository.findByCorporateName(customer.corporateName)
    if (existCustomerSameCnpj) {
      return left(new ExistCustomerSameCnpjError(customer.cnpj))
    }

    if (existCustomerSameName) {
      return left(new ExistCustomerSameNameError(customer.name))
    }

    if (existCustomerSameCorporateName) {
      return left(
        new ExistCustomerSameCorporateNameError(customer.corporateName),
      )
    }

    const newCustomer = Customer.create(customer)

    const customerCreated = await this.customerRepository.create(newCustomer)

    return right({
      customer: customerCreated,
    })
  }
}
