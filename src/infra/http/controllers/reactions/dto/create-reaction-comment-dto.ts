import { ApiProperty } from '@nestjs/swagger'

export class CreateReactionCommentDto {
  @ApiProperty()
  unified!: string

  @ApiProperty()
  commentId!: string
}
