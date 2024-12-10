import { ApiProperty } from '@nestjs/swagger'

export class UpdateOrderDto {
  @ApiProperty()
  order!: { id: string; order: number }[]
}
