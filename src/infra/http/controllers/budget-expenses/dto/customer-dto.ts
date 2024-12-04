import { ApiProperty } from '@nestjs/swagger'

export class CreateBudgetExpenseDto {
  @ApiProperty()
  amount!: number

  @ApiProperty()
  title!: string

  @ApiProperty()
  description?: string

  @ApiProperty()
  projectId!: string
}
