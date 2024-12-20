import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { CustomerNotFoundError } from './errors/customer-not-found'
import { ListProjectRepository } from '../repositories/list-projects-repository'
import { ListProjects } from '../../enterprise/entities/listProjects'

interface FetchListProjectsByCustomerUseCaseRequest {
  customerId: string
}

type FetchListProjectsByCustomerUseCaseResponse = Either<
  CustomerNotFoundError,
  {
    listProjects: ListProjects[]
  }
>

@Injectable()
export class FetchListProjectsByCustomerUseCase {
  constructor(private listProjectRepository: ListProjectRepository) {}

  async execute({
    customerId,
  }: FetchListProjectsByCustomerUseCaseRequest): Promise<FetchListProjectsByCustomerUseCaseResponse> {
    const listProjects =
      await this.listProjectRepository.findByCustomerId(customerId)

    for (const x of listProjects) {
      console.log(x.projects)
    }

    return right({
      listProjects,
    })
  }
}
