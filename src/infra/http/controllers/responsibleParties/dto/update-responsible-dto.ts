import { ApiProperty } from '@nestjs/swagger'

export class UpdateResponsiblePartiesDto {
  @ApiProperty()
  firstName?: string

  @ApiProperty()
  lastName?: string

  @ApiProperty()
  phone?: string

  @ApiProperty()
  birthdate?: Date

  @ApiProperty()
  email?: string
}
