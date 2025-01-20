import { PeriodicReport } from '@/domain/project/enterprise/entities/periodicReports'
import { Project } from '@/domain/project/enterprise/entities/project'
import { Project as PrismaProject } from '@prisma/client'

type ProjectProps = {
  name: string

  customer: {
    id: string
    name: string
  }
}
export class PeriodicReportPresenter {
  static toHTTP(periodicReport: PeriodicReport) {
    return {
      id: periodicReport.id.toString(),
      name: periodicReport.name,
      month: periodicReport.month,
      year: periodicReport.year,
      url: periodicReport.url,
      status: periodicReport.status,
      project: PeriodicReportPresenter.toHttpProjects(periodicReport.project),
    }
  }

  static toHttpProjects(
    value: ProjectProps | Project | PrismaProject | null | undefined,
  ) {
    const project = value as ProjectProps
    return {
      name: project.name,
      customer: project.customer,
    }
  }
}
