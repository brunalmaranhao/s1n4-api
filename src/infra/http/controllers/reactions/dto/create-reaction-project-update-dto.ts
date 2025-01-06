import { ApiProperty } from '@nestjs/swagger'

export class CreateReactionProjectUpdateDto {
  @ApiProperty()
  unified!: string

  @ApiProperty()
  projectUpdateId!: string
}
