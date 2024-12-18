import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  ConflictException,
  Delete,
  Param,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { Roles } from '@/infra/auth/roles.decorator'

import { BudgetExpenseNotFound } from '@/domain/project/application/use-cases/errors/budget-expense-not-found'
import { RemoveBudgetExpenseUseCase } from '@/domain/project/application/use-cases/remove-budget-expense'

@ApiTags('budget-expenses')
@Controller('/budget-expenses/:id')
export class RemoveBudgetExpenseController {
  constructor(private removeBudgetExpenseUseCase: RemoveBudgetExpenseUseCase) {}

  @Delete()
  @HttpCode(204)
  @Roles([
    'INTERNAL_MANAGEMENT',
    'INTERNAL_PARTNERS',
    'INTERNAL_FINANCIAL_LEGAL',
  ])
  async handle(@Param('id') id: string) {
    const result = await this.removeBudgetExpenseUseCase.execute({
      id,
    })

    if (result.isLeft()) {
      const error = result.value
      switch (error.constructor) {
        case BudgetExpenseNotFound:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
