import { PaginationParams } from '@/core/repositories/pagination-params'
import { ResponsibleParties } from '../../enterprise/entities/responsibleParties'
import { Status } from '@prisma/client'
import { ResponsiblePartiesEditProps } from '@/core/types/responsilbe-parties-props'

export abstract class ResponsiblePartiesRepository {
  abstract create(responsible: ResponsibleParties): Promise<ResponsibleParties>
  abstract findById(responsibleId: string): Promise<ResponsibleParties | null>
  abstract findByEmail(email: string): Promise<ResponsibleParties | null>

  abstract findAll({
    page,
    size,
  }: PaginationParams): Promise<ResponsibleParties[]>

  abstract fetchByStatus(
    status: Status,
    { page, size }: PaginationParams,
  ): Promise<ResponsibleParties[]>

  abstract update(
    userId: string,
    responsible: ResponsiblePartiesEditProps,
  ): Promise<ResponsibleParties>

  abstract remove(id: string): Promise<void>

  abstract fetchCustomerResponsibleParties(
    customerId: string,
    params: PaginationParams,
  ): Promise<ResponsibleParties[]>

  abstract fetchBirthdaysOfTheDay(
    params: PaginationParams,
  ): Promise<ResponsibleParties[]>

  abstract fetchBirthdaysOfTheMonth(
    params: PaginationParams,
  ): Promise<ResponsibleParties[]>
}
