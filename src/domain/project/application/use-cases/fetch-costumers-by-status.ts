import { Either, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { Customer } from '../../enterprise/entities/customer'
import { CustomerRepository } from '../repositories/customer-repository'
import { Status } from '@prisma/client'

interface FetchCostumersByStatusUseCaseRequest {
  size?: number
  page: number
  status: Status
}

type FetchCostumersByStatusUseCaseResponse = Either<
  null,
  {
    customers: Customer[]
    total: number
  }
>

@Injectable()
export class FetchCostumersByStatusUseCase {
  constructor(private customerRepository: CustomerRepository) {}

  async execute({
    status,
    page,
    size,
  }: FetchCostumersByStatusUseCaseRequest): Promise<FetchCostumersByStatusUseCaseResponse> {
    const response = await this.customerRepository.fetchByStatus(status, {
      page,
      size,
    })

    return right({
      customers: response.customers,
      total: response.total,
    })
  }
}
