import { ApiProperty } from '@nestjs/swagger'

export class UpdateBudgetExpenseDto {
  @ApiProperty()
  projectId!: string

  @ApiProperty()
  title!: string

  @ApiProperty()
  description!: string

  @ApiProperty()
  value!: number
}
