import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { CustomerRepository } from '../repositories/customer-repository'
import { CustomerNotFoundError } from './errors/customer-not-found'
import { Project } from '../../enterprise/entities/project'
import { ProjectRepository } from '../repositories/project-repository'

interface FetchCustomerProjectsUseCaseRequest {
  customerId: string
}

type FetchCustomerProjectsUseCaseResponse = Either<
  CustomerNotFoundError,
  {
    projects: Project[]
  }
>

@Injectable()
export class FetchCustomerProjectsUseCase {
  constructor(
    private customerRepository: CustomerRepository,
    private projectRepository: ProjectRepository,
  ) {}

  async execute({
    customerId,
  }: FetchCustomerProjectsUseCaseRequest): Promise<FetchCustomerProjectsUseCaseResponse> {
    const customer = await this.customerRepository.findById(customerId)

    if (!customer) {
      return left(new CustomerNotFoundError())
    }

    const projects = await this.projectRepository.fetchCustomerProjects(
      customer.id.toString(),
    )

    return right({
      projects,
    })
  }
}
