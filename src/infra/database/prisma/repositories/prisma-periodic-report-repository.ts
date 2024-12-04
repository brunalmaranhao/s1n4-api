import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { PeriodicReport } from '@/domain/project/enterprise/entities/periodicReports'
import { PeriodicReportRepository } from '@/domain/project/application/repositories/periodic-reports-repository'
import { PrismaPeriodicReportMapper } from '../mappers/prisma-periodic-report-mapper'

@Injectable()
export class PrismaPeriodicReportsRepository
  implements PeriodicReportRepository
{
  constructor(private prisma: PrismaService) {}

  async create(report: PeriodicReport): Promise<PeriodicReport> {
    const data = PrismaPeriodicReportMapper.toPrisma(report)

    const newReport = await this.prisma.periodicReports.create({
      data,
    })

    return PrismaPeriodicReportMapper.toDomain(newReport)
  }

  async findById(reportId: string): Promise<PeriodicReport | null> {
    const report = await this.prisma.periodicReports.findUnique({
      where: { id: reportId },
    })

    return report ? PrismaPeriodicReportMapper.toDomain(report) : null
  }

  async findAll({ page, size }: PaginationParams): Promise<PeriodicReport[]> {
    const amount = size || 20
    const reports = await this.prisma.periodicReports.findMany({
      orderBy: { createdAt: 'desc' },
      take: amount,
      skip: (page - 1) * amount,
    })

    return reports.map(PrismaPeriodicReportMapper.toDomain)
  }

  async findByName(name: string): Promise<PeriodicReport | null> {
    const report = await this.prisma.periodicReports.findFirst({
      where: { name, status: 'ACTIVE' },
    })

    return report ? PrismaPeriodicReportMapper.toDomain(report) : null
  }

  async findByMonthAndYearProjectId(
    month: string,
    year: string,
    projectId: string,
  ): Promise<PeriodicReport[]> {
    const reports = await this.prisma.periodicReports.findMany({
      where: {
        month,
        year,
        status: 'ACTIVE',
        projectId,
      },
      orderBy: { createdAt: 'desc' },
    })

    return reports.map(PrismaPeriodicReportMapper.toDomain)
  }

  async fetchByProjectId(
    projectId: string,
  ): Promise<{ reports: PeriodicReport[] }> {
    const [reports] = await this.prisma.$transaction([
      this.prisma.periodicReports.findMany({
        where: { projectId, status: 'ACTIVE' },
        orderBy: { createdAt: 'desc' },
        include: {
          project: true,
        },
      }),
    ])

    return {
      reports: reports.map(PrismaPeriodicReportMapper.toDomain),
    }
  }

  async fetchByCustomerId(
    customerId: string,
  ): Promise<{ reports: PeriodicReport[] }> {
    const [reports] = await this.prisma.$transaction([
      this.prisma.periodicReports.findMany({
        where: { project: { customerId }, status: 'ACTIVE' },
        orderBy: { createdAt: 'desc' },
        include: {
          project: true,
        },
      }),
    ])
    return {
      reports: reports.map(PrismaPeriodicReportMapper.toDomainWithProject),
    }
  }

  async fetchByCustomerIdAndYear(
    customerId: string,
    year: string,
  ): Promise<{ reports: PeriodicReport[] }> {
    const [reports] = await this.prisma.$transaction([
      this.prisma.periodicReports.findMany({
        where: { year, project: { customerId }, status: 'ACTIVE' },
        orderBy: { createdAt: 'desc' },
        include: {
          project: true,
        },
      }),
    ])
    return {
      reports: reports.map(PrismaPeriodicReportMapper.toDomainWithProject),
    }
  }

  async remove(id: string): Promise<void> {
    await this.prisma.periodicReports.update({
      where: { id },
      data: {
        status: 'INACTIVE',
      },
    })
  }
}
