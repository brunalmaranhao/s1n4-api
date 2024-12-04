import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { CustomerRepository } from '../repositories/customer-repository'
import { CustomerNotFoundError } from './errors/customer-not-found'
import { ResponsibleParties } from '../../enterprise/entities/responsibleParties'
import { ResponsiblePartiesRepository } from '../repositories/responsible-parties'

interface FetchCustomerResponsiblePartiesUseCaseRequest {
  page: number
  customerId: string
}

type FetchCustomerResponsiblePartiesUseCaseResponse = Either<
  CustomerNotFoundError,
  {
    responsibleParties: ResponsibleParties[]
  }
>

@Injectable()
export class FetchCustomerResponsiblePartiesUseCase {
  constructor(
    private customerRepository: CustomerRepository,
    private responsiblePartiesRepository: ResponsiblePartiesRepository,
  ) {}

  async execute({
    customerId,
    page,
  }: FetchCustomerResponsiblePartiesUseCaseRequest): Promise<FetchCustomerResponsiblePartiesUseCaseResponse> {
    const customer = await this.customerRepository.findById(customerId)

    if (!customer) {
      return left(new CustomerNotFoundError())
    }

    const responsibleParties =
      await this.responsiblePartiesRepository.fetchCustomerResponsibleParties(
        customer.id.toString(),
        {
          page,
        },
      )

    return right({
      responsibleParties,
    })
  }
}
