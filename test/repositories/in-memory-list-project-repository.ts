import { ListProjectRepository } from '@/domain/project/application/repositories/list-projects-repository'
import { ProjectNotFoundError } from '@/domain/project/application/use-cases/errors/project-not-found-error'
import { ListProjects } from '@/domain/project/enterprise/entities/listProjects'

export class InMemoryListProjectsRepository implements ListProjectRepository {
  public items: ListProjects[] = []

  async findByCustomerIdAndDate(
    customerId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<ListProjects[]> {
    const listProjects = this.items.filter((listProject) => {
      return (
        listProject.customerId.toString() === customerId &&
        listProject.status === 'ACTIVE'
      )
    })

    return listProjects
  }

  async findByCustomerId(customerId: string): Promise<ListProjects[]> {
    const listProjects = this.items.filter(
      (listProject) => listProject.customerId.toString() === customerId,
    )
    return listProjects
  }

  async create(project: ListProjects): Promise<ListProjects> {
    this.items.push(project)
    return project
  }

  async findByNameAndCustomerId(
    customerId: string,
    name: string,
  ): Promise<ListProjects | null> {
    const listProject = this.items.find(
      (item) => item.customerId.toString() === customerId && item.name === name,
    )
    return listProject ?? null
  }

  async findById(id: string): Promise<ListProjects | null> {
    const listProject = this.items.find((item) => item.id.toString() === id)
    return listProject ?? null
  }

  async update(id: string, name: string): Promise<ListProjects> {
    const listProjectIndex = this.items.findIndex(
      (item) => item.id.toString() === id,
    )
    if (listProjectIndex === -1) {
      throw new ProjectNotFoundError()
    }

    const existinglistProject = this.items[listProjectIndex]

    existinglistProject.name = name
    return existinglistProject
  }

  async remove(id: string): Promise<void> {
    const projectIndex = this.items.findIndex(
      (item) => item.id.toString() === id,
    )
    if (projectIndex === -1) {
      throw new ProjectNotFoundError()
    }
    this.items[projectIndex].status = 'INACTIVE'
  }

  async updateOrder(orderData: { id: string; order: number }[]): Promise<void> {
    orderData.forEach(({ id, order }) => {
      const listProject = this.items.find((item) => item.id.toString() === id)
      if (!listProject) {
        throw new ProjectNotFoundError()
      }
      listProject.order = order
    })

    this.items.sort((a, b) => a.order - b.order)
  }
}
