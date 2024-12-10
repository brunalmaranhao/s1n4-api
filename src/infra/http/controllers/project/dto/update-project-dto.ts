import { ApiProperty } from '@nestjs/swagger'

export class UpdateProjectDto {
  @ApiProperty()
  name?: string

  @ApiProperty()
  deadline?: Date | null

  @ApiProperty()
  customerId?: string

  @ApiProperty()
  budget?: number

  @ApiProperty()
  updatedAt?: Date

  @ApiProperty()
  shouldShowInformationsToCustomerUser?: boolean
}
