import { PaginationParams } from '@/core/repositories/pagination-params'
import { HistoryLog } from '../../enterprise/entities/historyLog'

export abstract class HistoryLogRepository {
  abstract create(history: HistoryLog): Promise<HistoryLog>
  abstract findById(historyId: string): Promise<HistoryLog | null>
  abstract findAll({ page, size }: PaginationParams): Promise<HistoryLog[]>
}
