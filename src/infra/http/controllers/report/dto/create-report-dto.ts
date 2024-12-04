import { ApiProperty } from '@nestjs/swagger'

export class CreateReportDto {
  @ApiProperty()
  name!: string

  @ApiProperty()
  pbiWorkspaceId!: string

  @ApiProperty()
  pbiReportId!: string

  @ApiProperty()
  customerId!: string
}
