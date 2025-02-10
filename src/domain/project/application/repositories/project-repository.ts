import { PaginationParams } from '@/core/repositories/pagination-params'
import { Project } from '../../enterprise/entities/project'
import { EditProjectProps } from '@/core/types/edit-project-props'
import { Status, StatusProject } from '@prisma/client'
import { Tag } from '../../enterprise/entities/tags'

export abstract class ProjectRepository {
  abstract create(project: Project): Promise<Project>
  abstract findById(projectId: string): Promise<Project | null>
  abstract findByName(name: string): Promise<Project | null>
  abstract findByNameAndCustomer(
    name: string,
    customerId: string,
  ): Promise<Project | null>

  abstract findAll({ page, size }: PaginationParams): Promise<Project[]>
  abstract findAllWithoutPagination(): Promise<{
    projects: Project[]
    total: number
  }>

  abstract update(id: string, project: EditProjectProps): Promise<Project>
  abstract updateName(id: string, name: string): Promise<Project>
  abstract remove(id: string): Promise<void>
  abstract fetchByStatus(
    status: Status,
    { page, size }: PaginationParams,
  ): Promise<Project[]>

  abstract fetchCustomerProjects(customerId: string): Promise<Project[]>
  abstract addProjectList(
    projectId: string,
    listProjectId: string,
    shouldSaveUpdateDate: boolean,
  ): Promise<void>

  abstract updateShouldShowInformationsToCustomerUser(
    id: string,
    value: boolean,
  ): Promise<void>

  abstract finishOrActive(id: string, isFinish: boolean): Promise<void>

  abstract findByStatus(
    status: StatusProject,
  ): Promise<{ projects: Project[]; total: number }>

  abstract findByStatusAndCustomer(
    status: StatusProject,
    customer: string,
  ): Promise<{ projects: Project[]; total: number }>

  abstract addTagToProject(projectId: string, tag: Tag): Promise<void>
  abstract removeTagFromProject(projectId: string, tagId: string): Promise<void>
  abstract getProjectsByDateRange(
    startDate: Date,
    endDate: Date,
    customerId: string,
  ): Promise<Project[]>

  abstract findOverdueProjects(
    date: Date,
    customerId?: string,
  ): Promise<{ overdueProjects: Project[]; totalActiveProjects: number }>
}
