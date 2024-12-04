import { ApiProperty } from '@nestjs/swagger'

export class RemoveCustomerDto {
  @ApiProperty()
  id!: string
}
