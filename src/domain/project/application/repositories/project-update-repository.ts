import { PaginationParams } from '@/core/repositories/pagination-params'
import { ProjectUpdate } from '../../enterprise/entities/projectUpdates'
import { Status } from '@prisma/client'

export abstract class ProjectUpdateRepository {
  abstract create(update: ProjectUpdate): Promise<ProjectUpdate>
  abstract findById(projectUpdateId: string): Promise<ProjectUpdate | null>
  abstract findAll({ page, size }: PaginationParams): Promise<ProjectUpdate[]>
  abstract update(updateId: string, description: string): Promise<ProjectUpdate>

  abstract fetchByStatusAndCustomerId(
    status: Status,
    customerId: string,
    params: PaginationParams,
  ): Promise<ProjectUpdate[]>

  abstract fetchAllProjectUpdates(
    params: PaginationParams,
    status: Status,
  ): Promise<ProjectUpdate[]>

  abstract fetchByProjectId(projectId: string): Promise<ProjectUpdate[]>

  abstract remove(id: string): Promise<void>
}
