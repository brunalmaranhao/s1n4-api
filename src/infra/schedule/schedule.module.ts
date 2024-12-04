import { Module } from '@nestjs/common'
import { ScheduleModule } from '@nestjs/schedule'
import { DatabaseModule } from '../database/database.module'
import { PbiModule } from '../pbi/pbi.module'
import { SuspendCapacitySchedulerService } from './report/suspend-capacity'
import { EnvModule } from '../env/env.module'
import { VerifyCapacitySchedulerService } from './report/verify-capacity'

@Module({
  imports: [ScheduleModule.forRoot(), DatabaseModule, PbiModule, EnvModule],
  providers: [SuspendCapacitySchedulerService, VerifyCapacitySchedulerService],
  exports: [SuspendCapacitySchedulerService, VerifyCapacitySchedulerService],
})
export class TaskScheduleModule {}
