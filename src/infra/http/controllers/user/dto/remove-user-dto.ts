import { ApiProperty } from '@nestjs/swagger'

export class RemoveUserDto {
  @ApiProperty()
  id!: string
}
