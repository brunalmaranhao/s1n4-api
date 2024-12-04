import { ApiProperty } from '@nestjs/swagger'

export class RemoveProjectUpdateDto {
  @ApiProperty()
  id!: string
}
