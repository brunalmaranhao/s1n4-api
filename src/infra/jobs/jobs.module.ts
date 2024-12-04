import { MiddlewareBuilder } from '@nestjs/core'
import { Module } from '@nestjs/common'
import { BullModule, InjectQueue } from '@nestjs/bull'

import { EnvModule } from '../env/env.module'
import { Queue } from 'bull'
import { createBullBoard } from 'bull-board'
import { BullAdapter } from 'bull-board/bullAdapter'
import { EnvService } from '../env/env.service'
import { DatabaseModule } from '../database/database.module'
import { CreateLogConsumer } from './log/create-log-consumer'
import { CreateLogProducer } from './log/create-log-producer'
import { CreateHistoryLogReportUseCase } from '@/domain/project/application/use-cases/create-history-log-report'
import { SendMailProducer } from './mail/send-mail-producer'
import { SendMailConsumer } from './mail/send-mail-consumer'
import { MailsModule } from '../mails/mails.module'

@Module({
  imports: [
    DatabaseModule,
    BullModule.forRootAsync({
      imports: [EnvModule],
      inject: [EnvService],
      useFactory: (env: EnvService) => ({
        redis: {
          host: env.get('DATABASE_REDIS_URL'),
          port: env.get('DATABASE_REDIS_PORT'),
          username: env.get('DATABASE_REDIS_USERNAME'),
          password: env.get('DATABASE_REDIS_PASSWORD'),
        },
      }),
    }),
    BullModule.registerQueue({
      name: 'create-log-queue',
    }),
    BullModule.registerQueue({
      name: 'send-mail-queue',
    }),
    EnvModule,
    MailsModule,
  ],
  providers: [
    CreateLogProducer,
    CreateLogConsumer,
    CreateHistoryLogReportUseCase,
    SendMailProducer,
    SendMailConsumer,
  ],
  exports: [CreateLogProducer, SendMailProducer],
})
export class JobsModule {
  constructor(
    @InjectQueue('create-log-queue') private smsQueue: Queue,
    @InjectQueue('send-mail-queue') private sendMail: Queue,
  ) {}

  configure(consumer: MiddlewareBuilder) {
    const { router } = createBullBoard([
      new BullAdapter(this.smsQueue),
      new BullAdapter(this.sendMail),
    ])
    consumer.apply(router).forRoutes('/admin/queues')
  }
}
