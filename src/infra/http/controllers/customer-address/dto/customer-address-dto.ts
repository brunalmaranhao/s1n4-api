import { ApiProperty } from '@nestjs/swagger'

export class CreateCustomerAddressDto {
  @ApiProperty()
  street!: string

  @ApiProperty()
  number!: string

  @ApiProperty()
  neighborhood!: string

  @ApiProperty()
  city!: string

  @ApiProperty()
  state!: string

  @ApiProperty()
  country!: string

  @ApiProperty()
  zipCode!: string

  @ApiProperty()
  customerId!: string

  @ApiProperty()
  complement?: string
}
