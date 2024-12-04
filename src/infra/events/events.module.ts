import { SendNotificationUseCase } from '@/domain/notification/application/use-cases/send-notification'
import { Module } from '@nestjs/common'
import { DatabaseModule } from '../database/database.module'
import { OnProjectUpdatedCreated } from '@/domain/notification/application/subscribers/on-project-update-created'

@Module({
  imports: [DatabaseModule],
  providers: [OnProjectUpdatedCreated, SendNotificationUseCase],
})
export class EventsModule {}
