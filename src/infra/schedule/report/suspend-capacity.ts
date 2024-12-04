import { PbiCapacityManagementService } from '@/infra/pbi/capacity-management'
import { Injectable } from '@nestjs/common'
import { CronJob } from 'cron'

@Injectable()
export class SuspendCapacitySchedulerService {
  constructor(
    private pbiCapacityManagementService: PbiCapacityManagementService,
  ) {}

  async suspendCapacityScheduler() {
    // const timeMinutes = this.config.get('PBI_TIME_MINUTES_SUSPEND_CAPACITY')
    const timeMinutes = 1
    const job = new CronJob(
      new Date(Date.now() + timeMinutes * 60 * 1000),
      () => {
        this.pbiCapacityManagementService.suspend()
      },
    )

    job.start()
  }
}
