import { Either, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { Project } from '../../enterprise/entities/project'
import { ProjectRepository } from '../repositories/project-repository'

interface FetchProjectByDateAndCustomerUseCaseRequest {
  startDate: Date
  endDate: Date
  customerId: string
}

type FetchProjectByDateAndCustomerUseCaseResponse = Either<
  null,
  {
    projects: Project[]
  }
>

@Injectable()
export class FetchProjectByDateAndCustomerUseCase {
  constructor(private projectRepository: ProjectRepository) {}

  async execute({
    startDate,
    endDate,
    customerId,
  }: FetchProjectByDateAndCustomerUseCaseRequest): Promise<FetchProjectByDateAndCustomerUseCaseResponse> {
    const response = await this.projectRepository.getProjectsByDateRange(
      startDate,
      endDate,
      customerId,
    )

    return right({
      projects: response,
    })
  }
}
