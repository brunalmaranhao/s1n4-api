import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { CustomerNotFoundError } from './errors/customer-not-found'
import { DepartmentRepository } from '../repositories/department'
import { Department } from '../../enterprise/entities/department'

type FetchDepartmentsUseCaseResponse = Either<
  CustomerNotFoundError,
  {
    departments: Department[]
  }
>

@Injectable()
export class FetchDepartmentsUseCase {
  constructor(private deparmentsRepository: DepartmentRepository) {}

  async execute(): Promise<FetchDepartmentsUseCaseResponse> {
    const departments = await this.deparmentsRepository.findAll()

    return right({
      departments,
    })
  }
}
