import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { CustomerNotFoundError } from './errors/customer-not-found'
import { ListProjectRepository } from '../repositories/list-projects-repository'
import { ListProjects } from '../../enterprise/entities/listProjects'

interface FetchListProjectsByCustomerAndDateUseCaseRequest {
  customerId: string
  startDate: Date
  endDate: Date
}

type FetchListProjectsByCustomerAndDateUseCaseResponse = Either<
  CustomerNotFoundError,
  {
    listProjects: ListProjects[]
  }
>

@Injectable()
export class FetchListProjectsByCustomerAndDateUseCase {
  constructor(private listProjectRepository: ListProjectRepository) {}

  async execute({
    customerId,
    startDate,
    endDate,
  }: FetchListProjectsByCustomerAndDateUseCaseRequest): Promise<FetchListProjectsByCustomerAndDateUseCaseResponse> {
    const listProjects =
      await this.listProjectRepository.findByCustomerIdAndDate(
        customerId,
        startDate,
        endDate,
      )

    return right({
      listProjects,
    })
  }
}
