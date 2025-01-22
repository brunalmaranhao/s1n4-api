import { ApiProperty } from '@nestjs/swagger'

export class CreateProjectDto {
  @ApiProperty()
  name!: string

  @ApiProperty()
  start!: Date

  @ApiProperty()
  deadline!: Date

  @ApiProperty()
  customerId!: string

  @ApiProperty()
  budget?: number

  @ApiProperty()
  listProjectsId!: string

  @ApiProperty()
  description!: string
}
