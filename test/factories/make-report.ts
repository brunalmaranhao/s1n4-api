import { faker } from '@faker-js/faker'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import {
  Report,
  ReportProps,
} from '@/domain/project/enterprise/entities/report'
import { PrismaReportMapper } from '@/infra/database/prisma/mappers/prisma-report-mapper'

export function makeReport(
  override: Partial<ReportProps> = {},
  id?: UniqueEntityID,
) {
  const report = Report.create(
    {
      name: faker.company.name(),
      pbiWorkspaceId: '1',
      pbiReportId: '1',
      customerId: new UniqueEntityID('1'),
      status: 'ACTIVE',
      ...override,
    },
    id,
  )

  return report
}

@Injectable()
export class ReportFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaReport(data: Partial<ReportProps> = {}): Promise<Report> {
    const report = makeReport(data)

    await this.prisma.report.create({
      data: PrismaReportMapper.toPrisma(report),
    })

    return report
  }
}
