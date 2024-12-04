import { DomainEvents } from '@/core/events/domain-events'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { PeriodicReportRepository } from '@/domain/project/application/repositories/periodic-reports-repository'
import { PeriodicReport } from '@/domain/project/enterprise/entities/periodicReports'

export class InMemoryPeriodicReportRepository
  implements PeriodicReportRepository
{
  public items: PeriodicReport[] = []

  async create(report: PeriodicReport): Promise<PeriodicReport> {
    this.items.push(report)
    DomainEvents.dispatchEventsForAggregate(report.id)
    return report
  }

  async findById(reportId: string): Promise<PeriodicReport | null> {
    const report = this.items.find((item) => item.id.toString() === reportId)
    return report || null
  }

  async findAll({ page, size }: PaginationParams): Promise<PeriodicReport[]> {
    const amount = size || 10
    const start = (page - 1) * amount
    const end = start + amount
    return this.items.slice(start, end)
  }

  async findByName(name: string): Promise<PeriodicReport | null> {
    const report = this.items.find((item) => item.name === name)
    return report || null
  }

  async findByMonthAndYearProjectId(
    month: string,
    year: string,
    projectId: string,
  ): Promise<PeriodicReport[]> {
    return this.items.filter(
      (item) =>
        item.month === month &&
        item.year === year &&
        item.projectId.toString() === projectId,
    )
  }

  async fetchByProjectId(
    projectId: string,
  ): Promise<{ reports: PeriodicReport[] }> {
    const reportsForProject = this.items.filter(
      (item) => item.projectId.toString() === projectId,
    )
    return { reports: reportsForProject }
  }

  async fetchByCustomerId(
    customerId: string,
  ): Promise<{ reports: PeriodicReport[] }> {
    const reportsForCustomer = this.items.filter(
      (item) => item.project?.customerId.toString() === customerId,
    )
    return { reports: reportsForCustomer }
  }

  async fetchByCustomerIdAndYear(
    customerId: string,
    year: string,
  ): Promise<{ reports: PeriodicReport[] }> {
    const reportsForCustomer = this.items.filter(
      (item) =>
        item.project?.customerId.toString() === customerId &&
        item.year === year,
    )
    return { reports: reportsForCustomer }
  }

  async remove(id: string): Promise<void> {
    const reportIndex = this.items.findIndex(
      (item) => item.id.toString() === id,
    )
    if (reportIndex === -1) {
      throw new Error('Report not found')
    }
    this.items.splice(reportIndex, 1)
  }
}
