import { ListProjects } from '../../enterprise/entities/listProjects'

export abstract class ListProjectRepository {
  abstract create(listProjects: ListProjects): Promise<ListProjects>
  abstract findById(projectId: string): Promise<ListProjects | null>
  abstract findByCustomerId(customerId: string): Promise<ListProjects[]>
  abstract findByCustomerIdAndDate(
    customerId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<ListProjects[]>

  abstract findByNameAndCustomerId(
    customerId: string,
    name: string,
  ): Promise<ListProjects | null>

  abstract update(id: string, name: string): Promise<ListProjects>
  abstract remove(id: string): Promise<void>
  abstract updateOrder(
    orderData: { id: string; order: number }[],
  ): Promise<void>
}
