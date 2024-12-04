import { CreateHistoryLogReportUseCase } from '@/domain/project/application/use-cases/create-history-log-report'
import { Report } from '@/domain/project/enterprise/entities/report'
import { EnvService } from '@/infra/env/env.service'
import { Process, Processor } from '@nestjs/bull'
import { Job } from 'bull'

type ReportProps = {
  _id: {
    value: string
  }
}

@Processor('create-log-queue')
class CreateLogConsumer {
  constructor(
    private config: EnvService,
    private createHistoryLogUseCase: CreateHistoryLogReportUseCase,
  ) {}

  @Process('create-log-report-job')
  async createLogReportJob(job: Job<{ reportId: string; userId: string }>) {
    const { data } = job

    await this.createHistoryLogUseCase.execute({
      reportId: data.reportId,
      userId: data.userId,
    })
  }

  @Process('create-log-reports-job')
  async createLogReportsJob(job: Job<{ reports: Report[]; userId: string }>) {
    const { data } = job
    for (const report of data.reports) {
      const castReport = report as unknown as ReportProps
      await this.createHistoryLogUseCase.execute({
        reportId: castReport._id.value,
        userId: data.userId,
      })
    }
  }
}

export { CreateLogConsumer }
