import { Report } from '@/domain/project/enterprise/entities/report'

export class ReportPresenter {
  static toHTTP(report: Report) {
    return {
      id: report.id.toString(),
      name: report.name,
      customerId: report.customerId.toString(),
      pbiReportId: report.pbiReportId,
      pbiWorkspaceId: report.pbiWorkspaceId,
      createdAt: report.createdAt,
    }
  }
}
