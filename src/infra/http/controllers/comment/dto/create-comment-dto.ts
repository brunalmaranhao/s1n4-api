import { ApiProperty } from '@nestjs/swagger'

export class CreateCommentDto {
  @ApiProperty()
  content!: string

  @ApiProperty()
  projectUpdateId!: string
}
