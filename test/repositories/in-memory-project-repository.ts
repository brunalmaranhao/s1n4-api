import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { EditProjectProps } from '@/core/types/edit-project-props'
import { ProjectRepository } from '@/domain/project/application/repositories/project-repository'
import { ProjectNotFoundError } from '@/domain/project/application/use-cases/errors/project-not-found-error'
import { Project } from '@/domain/project/enterprise/entities/project'
import { Status } from '@prisma/client'

export class InMemoryProjectRepository implements ProjectRepository {
  public items: Project[] = []
  async addProjectList(
    projectId: string,
    listProjectId: string,
  ): Promise<void> {
    const projectIndex = this.items.findIndex(
      (item) => item.id.toString() === projectId,
    )
    if (projectIndex === -1) {
      throw new ProjectNotFoundError()
    }

    const existingProject = this.items[projectIndex]

    existingProject.listProjectsId = new UniqueEntityID(listProjectId)
  }

  async fetchCustomerProjects(customerId: string): Promise<Project[]> {
    const projects = this.items.filter(
      (project) => project.customerId.toString() === customerId,
    )
    return projects
  }

  async create(project: Project): Promise<Project> {
    this.items.push(project)
    return project
  }

  async findById(projectId: string): Promise<Project | null> {
    const project = this.items.find((item) => item.id.toString() === projectId)
    return project ?? null
  }

  async findByName(name: string): Promise<Project | null> {
    const project = this.items.find((item) => item.name === name)
    return project ?? null
  }

  async findAll({ page, size }: PaginationParams): Promise<Project[]> {
    const amount = size || 20
    const projects = this.items.slice((page - 1) * amount, page * amount)
    return projects
  }

  async findAllWithoutPagination(): Promise<{
    projects: Project[]
    total: number
  }> {
    const projects = this.items

    return { projects, total: projects.length }
  }

  async update(id: string, project: EditProjectProps): Promise<Project> {
    const projectIndex = this.items.findIndex(
      (item) => item.id.toString() === id,
    )
    if (projectIndex === -1) {
      throw new ProjectNotFoundError()
    }

    const existingProject = this.items[projectIndex]

    existingProject.name = project.name ?? existingProject.name
    existingProject.deadline =
      project.deadline ?? existingProject.deadline ?? null
    existingProject.status = project.status ?? existingProject.status
    existingProject.customerId = project.customerId
      ? new UniqueEntityID(project.customerId)
      : existingProject.customerId

    return existingProject
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

  async fetchByStatus(
    status: Status,
    { page, size }: PaginationParams,
  ): Promise<Project[]> {
    const projects = this.items.filter((item) => item.status === status)
    return projects
  }
}
