import { ApiProperty } from '@nestjs/swagger'

export class UpdateProjectInfoVisibilityDto {
  @ApiProperty()
  shouldShowInformations!: boolean
}
