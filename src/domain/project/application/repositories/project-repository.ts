import { PaginationParams } from '@/core/repositories/pagination-params'
import { Project } from '../../enterprise/entities/project'
import { EditProjectProps } from '@/core/types/edit-project-props'
import { StatusProject } from '@prisma/client'

export abstract class ProjectRepository {
  abstract create(project: Project): Promise<Project>
  abstract findById(projectId: string): Promise<Project | null>
  abstract findByName(name: string): Promise<Project | null>
  abstract findAll({ page, size }: PaginationParams): Promise<Project[]>
  abstract findAllWithoutPagination(): Promise<{
    projects: Project[]
    total: number
  }>

  abstract update(id: string, project: EditProjectProps): Promise<Project>
  abstract remove(id: string): Promise<void>
  abstract fetchByStatus(
    status: StatusProject,
    { page, size }: PaginationParams,
  ): Promise<Project[]>

  abstract fetchCustomerProjects(customerId: string): Promise<Project[]>
}
