import { ApiProperty } from '@nestjs/swagger'

export class CreateProjectUpdateDto {
  @ApiProperty()
  description!: string

  @ApiProperty()
  projectId!: string
}
