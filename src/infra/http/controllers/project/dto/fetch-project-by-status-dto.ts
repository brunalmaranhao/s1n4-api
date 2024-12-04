import { ApiProperty } from '@nestjs/swagger'
import { StatusProject } from '@prisma/client'

export class FetchProjectByStatusDto {
  @ApiProperty({ enum: StatusProject, enumName: 'StatusProjectEnum' })
  statusProject!: StatusProject
}
