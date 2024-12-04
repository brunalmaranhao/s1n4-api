import { ApiProperty } from '@nestjs/swagger'

enum UserRoles {
  CLIENT_RESPONSIBLE = 'CLIENT_RESPONSIBLE',
  CLIENT_OWNER = 'CLIENT_OWNER',
  CLIENT_USER = 'CLIENT_USER',
}

export class UpdateUserDto {
  @ApiProperty()
  firstName?: string

  @ApiProperty()
  lastName?: string

  @ApiProperty({ enum: UserRoles, enumName: 'UserRoles' })
  role?: UserRoles
}
