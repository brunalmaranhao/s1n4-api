import { ApiProperty } from '@nestjs/swagger'

export class UpdateProjectNameDto {
  @ApiProperty()
  name!: string
}
