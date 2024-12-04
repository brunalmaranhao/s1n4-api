import { Report as PrismaReport, Prisma, Customer } from '@prisma/client'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Report } from '@/domain/project/enterprise/entities/report'

type ReportProps = PrismaReport & {
  customer: Customer
}
export class PrismaReportMapper {
  static toDomainWithCustomer(raw: ReportProps): Report {
    return Report.create(
      {
        name: raw.name,
        pbiReportId: raw.pbiReportId,
        pbiWorkspaceId: raw.pbiWorkspaceId,
        status: raw.status,
        customerId: new UniqueEntityID(raw.customerId),
        createdAt: raw.createdAt,
        customer: raw.customer,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toDomain(raw: PrismaReport): Report {
    return Report.create(
      {
        name: raw.name,
        pbiReportId: raw.pbiReportId,
        pbiWorkspaceId: raw.pbiWorkspaceId,
        status: raw.status,
        customerId: new UniqueEntityID(raw.customerId),
        createdAt: raw.createdAt,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(report: Report): Prisma.ReportUncheckedCreateInput {
    return {
      id: report.id.toString(),
      name: report.name,
      pbiReportId: report.pbiReportId,
      pbiWorkspaceId: report.pbiWorkspaceId,
      status: report.status,
      customerId: report.customerId.toString(),
      createdAt: report.createdAt,
      updatedAt: report.updatedAt,
    }
  }
}
