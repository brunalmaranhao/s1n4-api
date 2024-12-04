import { ApiProperty } from '@nestjs/swagger'

export class RemoveProjectDto {
  @ApiProperty()
  id!: string
}
