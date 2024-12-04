import { faker } from '@faker-js/faker'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import {
  PeriodicReport,
  PeriodicReportProps,
} from '@/domain/project/enterprise/entities/periodicReports'
import { PrismaPeriodicReportMapper } from '@/infra/database/prisma/mappers/prisma-periodic-report-mapper'

export function makePeriodicReport(
  override: Partial<PeriodicReportProps> = {},
  id?: UniqueEntityID,
) {
  const periodicReport = PeriodicReport.create(
    {
      name: faker.company.name(),
      url: 'url',
      year: '2025',
      month: '01',
      projectId: new UniqueEntityID('12'),

      ...override,
    },
    id,
  )

  return periodicReport
}

@Injectable()
export class PeriodicReportFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaPeriodicReport(
    data: Partial<PeriodicReportProps> = {},
  ): Promise<PeriodicReport> {
    const periodicReport = makePeriodicReport(data)

    await this.prisma.periodicReports.create({
      data: PrismaPeriodicReportMapper.toPrisma(periodicReport),
    })

    return periodicReport
  }
}
