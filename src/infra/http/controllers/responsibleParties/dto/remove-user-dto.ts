import { ApiProperty } from '@nestjs/swagger'

export class RemoveResponsiblePartiesDto {
  @ApiProperty()
  id!: string
}
