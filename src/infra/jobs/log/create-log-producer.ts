import { Report } from '@/domain/project/enterprise/entities/report'
import { InjectQueue } from '@nestjs/bull'
import { Injectable } from '@nestjs/common'
import { Queue } from 'bull'

@Injectable()
class CreateLogProducer {
  constructor(@InjectQueue('create-log-queue') private logQueue: Queue) {}

  async createLogReport(reportId: string, userId: string) {
    this.logQueue.add('create-log-report-job', {
      reportId,
      userId,
    })
  }

  async createLogReports(reports: Report[], userId: string) {
    this.logQueue.add('create-log-reports-job', {
      reports,
      userId,
    })
  }
}

export { CreateLogProducer }
