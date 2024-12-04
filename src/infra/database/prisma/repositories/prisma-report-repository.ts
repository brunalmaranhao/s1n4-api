import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { ReportRepository } from '@/domain/project/application/repositories/report-repository'
import { Report } from '@/domain/project/enterprise/entities/report'
import { PrismaReportMapper } from '../mappers/prisma-report-mapper'
import { Status } from '@prisma/client'

@Injectable()
export class PrismaReportsRepository implements ReportRepository {
  constructor(private prisma: PrismaService) {}
  async updateStatus(reportId: string, status: Status): Promise<void> {
    await this.prisma.report.update({
      where: {
        id: reportId,
      },
      data: {
        status,
      },
    })
  }

  async findByCustomerId(
    { page, size }: PaginationParams,
    customerId: string,
  ): Promise<{ reports: Report[]; total: number }> {
    const amount = size || 4

    const [reports, total] = await this.prisma.$transaction([
      this.prisma.report.findMany({
        where: {
          status: 'ACTIVE',
          customerId,
        },
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          customer: true,
        },
        take: amount,
        skip: (page - 1) * amount,
      }),
      this.prisma.report.count({
        where: {
          status: 'ACTIVE',
          customerId,
        },
      }),
    ])

    return {
      reports: reports.map(PrismaReportMapper.toDomainWithCustomer),
      total,
    }
  }

  async findByWorkspaceIdAndReportId(
    pbiWorkspaceId: string,
    pbiReportId: string,
  ): Promise<Report | null> {
    const report = await this.prisma.report.findFirst({
      where: {
        pbiReportId,
        pbiWorkspaceId,
        status: 'ACTIVE',
      },
    })

    if (!report) {
      return null
    }

    return PrismaReportMapper.toDomain(report)
  }

  // async findAll({ page, size }: PaginationParams): Promise<Report[]> {
  //   const amount = size || 4
  //   const reports = await this.prisma.report.findMany({
  //     take: amount,
  //     skip: (page - 1) * amount,
  //     include: {
  //       customer: true,
  //     },
  //     where: {
  //       status: 'ACTIVE',
  //     },
  //   })
  //   return reports.map(PrismaReportMapper.toDomainWithCustomer)
  // }

  async findAll({
    page,
    size,
  }: PaginationParams): Promise<{ reports: Report[]; total: number }> {
    const amount = size || 4

    const [reports, total] = await this.prisma.$transaction([
      this.prisma.report.findMany({
        where: {
          status: 'ACTIVE',
        },
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          customer: true,
        },
        take: amount,
        skip: (page - 1) * amount,
      }),
      this.prisma.report.count({
        where: {
          status: 'ACTIVE',
        },
      }),
    ])

    return {
      reports: reports.map(PrismaReportMapper.toDomainWithCustomer),
      total,
    }
  }

  async findById(id: string): Promise<Report | null> {
    const report = await this.prisma.report.findUnique({
      where: {
        id,
      },
    })

    if (!report) {
      return null
    }

    return PrismaReportMapper.toDomain(report)
  }

  async create(report: Report): Promise<Report> {
    const data = PrismaReportMapper.toPrisma(report)

    const newReport = await this.prisma.report.create({
      data,
    })
    return PrismaReportMapper.toDomain(newReport)
  }
}
