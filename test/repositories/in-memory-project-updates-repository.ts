import { PaginationParams } from '@/core/repositories/pagination-params'
import { ProjectUpdateRepository } from '@/domain/project/application/repositories/project-update-repository'
import { ProjectNotFoundError } from '@/domain/project/application/use-cases/errors/project-not-found-error'
import { ProjectUpdate } from '@/domain/project/enterprise/entities/projectUpdates'
import { $Enums, Status } from '@prisma/client'

export class InMemoryProjectUpdateRepository
  implements ProjectUpdateRepository
{
  public items: ProjectUpdate[] = []

  async fetchAllProjectUpdates(
    params: PaginationParams,
    status: Status,
  ): Promise<ProjectUpdate[]> {
    return this.items.filter((item) => item.status === 'ACTIVE')
  }

  async create(project: ProjectUpdate): Promise<ProjectUpdate> {
    this.items.push(project)
    return project
  }

  async findById(projectId: string): Promise<ProjectUpdate | null> {
    const project = this.items.find((item) => item.id.toString() === projectId)
    return project ?? null
  }

  async findAll({ page, size }: PaginationParams): Promise<ProjectUpdate[]> {
    const amount = size || 20
    const projects = this.items.slice((page - 1) * amount, page * amount)
    return projects
  }

  async update(id: string, description: string): Promise<ProjectUpdate> {
    const projectIndex = this.items.findIndex(
      (item) => item.id.toString() === id,
    )
    if (projectIndex === -1) {
      throw new ProjectNotFoundError()
    }

    const project = this.items[projectIndex]
    project.description = description
    return project
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

  async fetchByStatusAndCustomerId(
    status: $Enums.Status,
    customerId: string,
    params: PaginationParams,
  ): Promise<ProjectUpdate[]> {
    const projects = this.items.filter((item) => item.status === status)
    return projects
  }
}
