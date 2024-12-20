import { ApiProperty } from '@nestjs/swagger'

export class CreateProjectDto {
  @ApiProperty()
  name!: string

  @ApiProperty()
  deadline?: Date | null

  @ApiProperty()
  customerId!: string

  @ApiProperty()
  budget!: number

  @ApiProperty()
  listProjectsId!: string

  @ApiProperty()
  description!: string
}
