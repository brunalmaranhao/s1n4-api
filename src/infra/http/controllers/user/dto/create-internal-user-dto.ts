import { ApiProperty } from '@nestjs/swagger'

enum UserRoles {
  INTERNAL_PARTNERS = 'CLIENT_RESPONSIBLE',
  INTERNAL_FINANCIAL_LEGAL = 'INTERNAL_FINANCIAL_LEGAL',
}

export class CreateInternalUserDto {
  @ApiProperty()
  firstName!: string

  @ApiProperty()
  lastName!: string

  @ApiProperty()
  password!: string

  @ApiProperty()
  email!: string

  @ApiProperty({ enum: UserRoles, enumName: 'UserRoles' })
  role!: UserRoles
}
