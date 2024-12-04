import { ApiProperty } from '@nestjs/swagger'

export class UpdatePasswordDto {
  @ApiProperty()
  token!: string

  @ApiProperty()
  email!: string

  @ApiProperty()
  password!: string
}
