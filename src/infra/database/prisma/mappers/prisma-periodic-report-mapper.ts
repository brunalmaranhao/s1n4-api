import {
  PeriodicReports as PrismaPeriodicReports,
  Project as PrismaProject,
  Prisma,
} from '@prisma/client'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { PeriodicReport } from '@/domain/project/enterprise/entities/periodicReports'

type PrismaPeriodicReportWithProject = PrismaPeriodicReports & {
  project: PrismaProject
}

export class PrismaPeriodicReportMapper {
  static toDomain(raw: PrismaPeriodicReports): PeriodicReport {
    return PeriodicReport.create(
      {
        name: raw.name,
        month: raw.month,
        year: raw.year,
        url: raw.url,
        projectId: new UniqueEntityID(raw.projectId),
        status: raw.status,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toDomainWithProject(
    raw: PrismaPeriodicReportWithProject,
  ): PeriodicReport {
    return PeriodicReport.create(
      {
        name: raw.name,
        month: raw.month,
        year: raw.year,
        url: raw.url,
        projectId: new UniqueEntityID(raw.projectId),
        project: raw.project,
        status: raw.status,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(
    report: PeriodicReport,
  ): Prisma.PeriodicReportsUncheckedCreateInput {
    return {
      id: report.id.toString(),
      name: report.name,
      month: report.month,
      year: report.year,
      url: report.url,
      projectId: report.projectId.toString(),
      status: report.status,
      createdAt: report.createdAt || new Date(),
      updatedAt: report.updatedAt,
    }
  }
}
