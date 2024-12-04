import { PaginationParams } from '@/core/repositories/pagination-params'
import { ReportRepository } from '@/domain/project/application/repositories/report-repository'
import { Report } from '@/domain/project/enterprise/entities/report'
import { Status } from '@prisma/client'

export class InMemoryReportRepository implements ReportRepository {
  public items: Report[] = []

  async updateStatus(reportId: string, status: Status): Promise<void> {
    const itemIndex = this.items.findIndex(
      (item) => item.id.toString() === reportId,
    )
    const report = this.items[itemIndex]
    report.status = status
  }

  async create(report: Report): Promise<Report> {
    this.items.push(report)
    return report
  }

  async findByWorkspaceIdAndReportId(
    pbiWorkspaceId: string,
    pbiReportId: string,
  ): Promise<Report | null> {
    const report = this.items.find(
      (item) =>
        item.pbiWorkspaceId === pbiWorkspaceId &&
        item.pbiReportId === pbiReportId,
    )

    return report ?? null
  }

  async findById(reportId: string): Promise<Report | null> {
    const report = this.items.find((item) => item.id.toString() === reportId)
    return report ?? null
  }

  async findAll({
    page,
    size,
  }: PaginationParams): Promise<{ reports: Report[]; total: number }> {
    const amount = size || 20
    const reports = this.items.slice((page - 1) * amount, page * amount)
    return { reports, total: reports.length }
  }

  async findByCustomerId(
    { page, size }: PaginationParams,
    customerId: string,
  ): Promise<{ reports: Report[]; total: number }> {
    const reports = this.items.filter(
      (item) => item.customerId.toString() === customerId,
    )
    return { reports, total: reports.length }
  }
}
