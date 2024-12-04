import { PaginationParams } from '@/core/repositories/pagination-params'
import { HistoryLogRepository } from '@/domain/project/application/repositories/history-repository'
import { HistoryLog } from '@/domain/project/enterprise/entities/historyLog'

export class InMemoryHistoryLogRepository implements HistoryLogRepository {
  public items: HistoryLog[] = []

  async create(historyLog: HistoryLog): Promise<HistoryLog> {
    this.items.push(historyLog)

    return historyLog
  }

  async findById(historyLogId: string): Promise<HistoryLog | null> {
    const historyLog = this.items.find(
      (item) => item.id.toString() === historyLogId,
    )

    if (!historyLog) {
      return null
    }

    return historyLog
  }

  async findAll({ page }: PaginationParams): Promise<HistoryLog[]> {
    const historyLog = this.items.slice((page - 1) * 20, page * 20)

    return historyLog
  }
}
