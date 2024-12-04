import { ApiProperty } from '@nestjs/swagger'

export class UpdateProjectUpdateDto {
  @ApiProperty()
  description!: string
}
