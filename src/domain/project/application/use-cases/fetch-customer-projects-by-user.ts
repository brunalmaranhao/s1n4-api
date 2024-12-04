import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { CustomerRepository } from '../repositories/customer-repository'
import { CustomerNotFoundError } from './errors/customer-not-found'
import { Project } from '../../enterprise/entities/project'
import { ProjectRepository } from '../repositories/project-repository'
import { UserRepository } from '../repositories/user-repository'

interface FetchCustomerProjectsUseCaseRequest {
  userId: string
}

type FetchCustomerProjectsUseCaseResponse = Either<
  CustomerNotFoundError,
  {
    projects: Project[]
  }
>

@Injectable()
export class FetchCustomerProjectsByUserUseCase {
  constructor(
    private userRepository: UserRepository,
    private customerRepository: CustomerRepository,
    private projectRepository: ProjectRepository,
  ) {}

  async execute({
    userId,
  }: FetchCustomerProjectsUseCaseRequest): Promise<FetchCustomerProjectsUseCaseResponse> {
    // const customer = await this.customerRepository.findById(customerId)
    const user = await this.userRepository.findById(userId)
    if (!user?.customerId) {
      return left(new CustomerNotFoundError())
    }
    const customer = await this.customerRepository.findById(
      user?.customerId?.toString(),
    )

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
