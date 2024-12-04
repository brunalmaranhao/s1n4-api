import { Module } from '@nestjs/common'
import { EnvModule } from '../env/env.module'
import { PbiCapacityManagementService } from './capacity-management'
import { PbiEmbedService } from './embed'
import { PbiAuthService } from './auth'

@Module({
  providers: [PbiAuthService, PbiCapacityManagementService, PbiEmbedService],
  exports: [PbiAuthService, PbiCapacityManagementService, PbiEmbedService],
  imports: [EnvModule],
})
export class PbiModule {}
