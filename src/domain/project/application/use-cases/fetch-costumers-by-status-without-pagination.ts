import { Either, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { Customer } from '../../enterprise/entities/customer'
import { CustomerRepository } from '../repositories/customer-repository'
import { Status } from '@prisma/client'

interface FetchCostumersByStatusWithoutPaginationUseCaseRequest {
  status: Status
}

type FetchCostumersByStatusWithoutPaginationUseCaseResponse = Either<
  null,
  {
    customers: Customer[]
    total: number
  }
>

@Injectable()
export class FetchCostumersByStatusWithoutPaginationUseCase {
  constructor(private customerRepository: CustomerRepository) {}

  async execute({
    status,
  }: FetchCostumersByStatusWithoutPaginationUseCaseRequest): Promise<FetchCostumersByStatusWithoutPaginationUseCaseResponse> {
    const response =
      await this.customerRepository.fetchByStatusWithoutPagination(status)

    return right({
      customers: response.customers,
      total: response.total,
    })
  }
}
