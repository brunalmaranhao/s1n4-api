import { ApiProperty } from '@nestjs/swagger'

export class AddProjectToListProjectDto {
  @ApiProperty()
  listProjectId!: string

  @ApiProperty()
  projectId!: string
}
