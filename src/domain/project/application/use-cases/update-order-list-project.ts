import { Either, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { ListProjectRepository } from '../repositories/list-projects-repository'

interface UpdateOrderListProjectUseCaseRequest {
  orderData: { id: string; order: number }[]
}

type UpdateOrderListProjectUseCaseResponse = Either<null, null>

@Injectable()
export class UpdateOrderListProjectUseCase {
  constructor(private listProjectRepository: ListProjectRepository) {}

  async execute({
    orderData,
  }: UpdateOrderListProjectUseCaseRequest): Promise<UpdateOrderListProjectUseCaseResponse> {
    await this.listProjectRepository.updateOrder(orderData)

    return right(null)
  }
}
