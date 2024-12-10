import { ApiProperty } from '@nestjs/swagger'

export class CreateListProjectDto {
  @ApiProperty()
  name!: string

  @ApiProperty()
  customerId!: string
}
