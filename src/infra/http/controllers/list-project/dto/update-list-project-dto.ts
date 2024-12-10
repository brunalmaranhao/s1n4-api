import { ApiProperty } from '@nestjs/swagger'

export class UpdateListProjectDto {
  @ApiProperty()
  name!: string

  @ApiProperty()
  id!: string
}
