import { ApiProperty } from '@nestjs/swagger'

export class ValidateCustomerDto {
  @ApiProperty()
  name!: string

  @ApiProperty()
  corporateName!: string

  @ApiProperty()
  cnpj!: string
}
