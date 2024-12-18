import { ApiProperty } from '@nestjs/swagger'

export class AddOrRemoveTagToProjectDto {
  @ApiProperty()
  projectId!: string

  @ApiProperty()
  tagId!: string
}
