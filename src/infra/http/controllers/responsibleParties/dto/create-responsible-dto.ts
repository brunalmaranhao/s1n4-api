import { ApiProperty } from '@nestjs/swagger'
import { ResponsiblePartiesRole } from '@prisma/client'

export class CreateResponsiblePartiesDto {
  @ApiProperty()
  firstName!: string

  @ApiProperty()
  lastName!: string

  @ApiProperty()
  phone!: string

  @ApiProperty()
  birthdate!: Date

  @ApiProperty()
  email!: string

  @ApiProperty()
  customerId!: string

  @ApiProperty({
    enum: ResponsiblePartiesRole,
    enumName: 'ResponsiblePartiesRoleEnum',
  })
  responsiblePartiesRole!: ResponsiblePartiesRole[]
}
