import { PaginationParams } from '@/core/repositories/pagination-params'
import { Report } from '../../enterprise/entities/report'
import { Status } from '@prisma/client'

export abstract class ReportRepository {
  abstract create(report: Report): Promise<Report>
  abstract findById(reportId: string): Promise<Report | null>
  abstract updateStatus(reportId: string, status: Status): Promise<void>
  abstract findByCustomerId(
    { page, size }: PaginationParams,
    customerId: string,
  ): Promise<{ reports: Report[]; total: number }>

  abstract findAll({
    page,
    size,
  }: PaginationParams): Promise<{ reports: Report[]; total: number }>

  abstract findByWorkspaceIdAndReportId(
    workspaceId: string,
    reportId: string,
  ): Promise<Report | null>
}
