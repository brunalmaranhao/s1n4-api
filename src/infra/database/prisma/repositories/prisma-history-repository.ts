import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { HistoryLogRepository } from '@/domain/project/application/repositories/history-repository'
import { HistoryLog } from '@/domain/project/enterprise/entities/historyLog'
import { PrismaHistoryMapper } from '../mappers/prisma-history-mapper'

@Injectable()
export class PrismaHistoryLogsRepository implements HistoryLogRepository {
  constructor(private prisma: PrismaService) {}
  async findAll({ page, size }: PaginationParams): Promise<HistoryLog[]> {
    const amount = size || 20
    const histories = await this.prisma.historyLog.findMany({
      take: amount,
      skip: (page - 1) * amount,
    })
    return histories.map(PrismaHistoryMapper.toDomain)
  }

  async findById(id: string): Promise<HistoryLog | null> {
    const history = await this.prisma.historyLog.findUnique({
      where: {
        id,
      },
    })

    if (!history) {
      return null
    }

    return PrismaHistoryMapper.toDomain(history)
  }

  async create(history: HistoryLog): Promise<HistoryLog> {
    const data = PrismaHistoryMapper.toPrisma(history)

    const newHistory = await this.prisma.historyLog.create({
      data,
    })
    return PrismaHistoryMapper.toDomain(newHistory)
  }
}
