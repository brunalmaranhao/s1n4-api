import { Either, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { StatusProject } from '@prisma/client'
import { Project } from '../../enterprise/entities/project'
import { ProjectRepository } from '../repositories/project-repository'

interface FetchProjectByStatusAndCustomerUseCaseRequest {
  status: StatusProject
  customerId: string
}

type FetchProjectByStatusAndCustomerUseCaseResponse = Either<
  null,
  {
    projects: Project[]
    total: number
  }
>

@Injectable()
export class FetchProjectByStatusAndCustomerUseCase {
  constructor(private projectRepository: ProjectRepository) {}

  async execute({
    status,
    customerId,
  }: FetchProjectByStatusAndCustomerUseCaseRequest): Promise<FetchProjectByStatusAndCustomerUseCaseResponse> {
    const response = await this.projectRepository.findByStatusAndCustomer(
      status,
      customerId,
    )

    return right({
      projects: response.projects,
      total: response.total,
    })
  }
}
