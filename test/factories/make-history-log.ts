import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import {
  HistoryLog,
  HistoryLogProps,
} from '@/domain/project/enterprise/entities/historyLog'
import { PrismaHistoryMapper } from '@/infra/database/prisma/mappers/prisma-history-mapper'

export function makeHistoryLog(
  override: Partial<HistoryLogProps> = {},
  id?: UniqueEntityID,
) {
  const historyLog = HistoryLog.create(
    {
      userId: new UniqueEntityID('1'),
      action: 'ACCESS_REPORT',
      ...override,
    },
    id,
  )

  return historyLog
}

@Injectable()
export class HistoryLogFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaHistoryLog(
    data: Partial<HistoryLogProps> = {},
  ): Promise<HistoryLog> {
    const historyLog = makeHistoryLog(data)

    await this.prisma.historyLog.create({
      data: PrismaHistoryMapper.toPrisma(historyLog),
    })

    return historyLog
  }
}
