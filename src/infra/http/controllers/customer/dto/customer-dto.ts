import { ApiProperty } from '@nestjs/swagger'

export class CreateCustomerDto {
  @ApiProperty()
  contractDuration?: string

  @ApiProperty()
  contractValue?: number

  @ApiProperty()
  paymentMethods?: string

  @ApiProperty()
  accumulatedInvestment?: number

  @ApiProperty()
  expenditureProjection?: number

  @ApiProperty()
  contractObjective?: string

  @ApiProperty()
  contractedServices?: string

  @ApiProperty()
  name!: string

  @ApiProperty()
  corporateName!: string

  @ApiProperty()
  cnpj!: string
}
