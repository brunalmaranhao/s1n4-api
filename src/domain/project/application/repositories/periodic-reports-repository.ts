import { PaginationParams } from '@/core/repositories/pagination-params'
import { PeriodicReport } from '../../enterprise/entities/periodicReports'

export abstract class PeriodicReportRepository {
  abstract create(report: PeriodicReport): Promise<PeriodicReport>
  abstract findById(reportId: string): Promise<PeriodicReport | null>
  abstract findAll({ page, size }: PaginationParams): Promise<PeriodicReport[]>
  abstract findAllWithoutPagination(): Promise<PeriodicReport[]>

  abstract findByName(name: string): Promise<PeriodicReport | null>
  abstract findByMonthAndYearProjectId(
    month: string,
    year: string,
    projectId: string,
  ): Promise<PeriodicReport[]>

  abstract fetchByProjectId(
    projectId: string,
  ): Promise<{ reports: PeriodicReport[] }>

  abstract fetchByCustomerId(
    customerId: string,
  ): Promise<{ reports: PeriodicReport[] }>

  abstract fetchByCustomerIdAndYear(
    customerId: string,
    year: string,
  ): Promise<{ reports: PeriodicReport[] }>

  abstract remove(id: string): Promise<void>
}
