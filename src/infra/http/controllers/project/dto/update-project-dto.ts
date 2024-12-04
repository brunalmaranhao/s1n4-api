import { ApiProperty } from '@nestjs/swagger'
import { StatusProject } from '@prisma/client'

export class UpdateProjectDto {
  @ApiProperty()
  name?: string

  @ApiProperty()
  deadline?: Date | null

  @ApiProperty()
  customerId?: string

  @ApiProperty()
  budget?: number

  @ApiProperty({ enum: StatusProject, enumName: 'StatusProject' })
  statusProject?: StatusProject

  @ApiProperty()
  updatedAt?: Date
}
