import { PbiCapacityManagementService } from '@/infra/pbi/capacity-management'
import { Injectable, Logger } from '@nestjs/common'
import { Cron, CronExpression } from '@nestjs/schedule'

@Injectable()
export class VerifyCapacitySchedulerService {
  private readonly logger = new Logger(VerifyCapacitySchedulerService.name)
  private consecutiveSucceededMinutes = 0
  constructor(
    private pbiCapacityManagementService: PbiCapacityManagementService,
  ) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async verifyCapacityScheduler() {
    const timeLimit = 30
    const response = await this.pbiCapacityManagementService.getCapacityState()
    const responseObject = await response?.json()
    console.log(responseObject.value[0].properties.state)

    if (responseObject.value[0].properties.state === 'Succeeded') {
      this.consecutiveSucceededMinutes++
    } else {
      this.consecutiveSucceededMinutes = 0
    }

    if (this.consecutiveSucceededMinutes >= timeLimit) {
      await this.pbiCapacityManagementService.suspend()
      this.consecutiveSucceededMinutes = 0
    }
  }
}
