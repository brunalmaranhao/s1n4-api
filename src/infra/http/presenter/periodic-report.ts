import { PeriodicReport } from '@/domain/project/enterprise/entities/periodicReports'

export class PeriodicReportPresenter {
  static toHTTP(periodicReport: PeriodicReport) {
    return {
      id: periodicReport.id.toString(),
      name: periodicReport.name,
      month: periodicReport.month,
      year: periodicReport.year,
      url: periodicReport.url,
      status: periodicReport.status,
      project: {
        name: periodicReport.project?.name,
      },
    }
  }
}
