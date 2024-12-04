import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { CustomerRepository } from '../repositories/customer-repository'
import { ExistCustomerSameCnpjError } from './errors/exist-customer-same-cnpj-error'
import { ExistCustomerSameNameError } from './errors/exist-customer-same-name-error'
import { ExistCustomerSameCorporateNameError } from './errors/exist-customer-same-corporate-name-error'

interface ValidateCustomerUseCaseRequest {
  name: string
  corporateName: string
  cnpj: string
}

type ValidateCustomerUseCaseResponse = Either<
  | ExistCustomerSameCnpjError
  | ExistCustomerSameNameError
  | ExistCustomerSameCorporateNameError,
  null
>

@Injectable()
export class ValidateCustomerUseCase {
  constructor(private customerRepository: CustomerRepository) {}

  async execute({
    name,
    corporateName,
    cnpj,
  }: ValidateCustomerUseCaseRequest): Promise<ValidateCustomerUseCaseResponse> {
    const existCustomerSameCnpj = await this.customerRepository.findByCnpj(cnpj)

    const existCustomerSameName = await this.customerRepository.findByName(name)

    const existCustomerSameCorporateName =
      await this.customerRepository.findByCorporateName(corporateName)
    if (existCustomerSameCnpj) {
      return left(new ExistCustomerSameCnpjError(cnpj))
    }

    if (existCustomerSameName) {
      return left(new ExistCustomerSameNameError(name))
    }

    if (existCustomerSameCorporateName) {
      return left(new ExistCustomerSameCorporateNameError(corporateName))
    }

    return right(null)
  }
}
