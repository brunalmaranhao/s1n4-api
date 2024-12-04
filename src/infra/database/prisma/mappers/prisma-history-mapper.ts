import { HistoryLog as PrismaHistory, Prisma } from '@prisma/client'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { HistoryLog } from '@/domain/project/enterprise/entities/historyLog'

export class PrismaHistoryMapper {
  static toDomain(raw: PrismaHistory): HistoryLog {
    return HistoryLog.create(
      {
        userId: new UniqueEntityID(raw.userId),
        projectId: new UniqueEntityID(raw.projectId),
        reportId: new UniqueEntityID(raw.reportId),
        action: raw.action,
        createdAt: raw.createdAt,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(history: HistoryLog): Prisma.HistoryLogUncheckedCreateInput {
    return {
      id: history.id.toString(),
      userId: history.userId.toString(),
      projectId: history.projectId?.toString(),
      reportId: history.reportId?.toString(),
      action: history.action,
      createdAt: history.createdAt,
    }
  }
}
