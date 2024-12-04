import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { envSchema } from './env/env'
import { HttpModule } from './http/http.module'
import { EnvModule } from './env/env.module'
import { AuthModule } from './auth/auth.module'
import { PbiModule } from './pbi/pbi.module'
import { TaskScheduleModule } from './schedule/schedule.module'
import { EventsModule } from './events/events.module'
import { JobsModule } from './jobs/jobs.module'
import { ServeStaticModule } from '@nestjs/serve-static'
import { join } from 'path'

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    HttpModule,
    EnvModule,
    AuthModule,
    PbiModule,
    TaskScheduleModule,
    EventsModule,
    JobsModule,
  ],
})
export class AppModule {}
