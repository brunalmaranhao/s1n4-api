import { z } from 'zod'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'
import { ApiTags } from '@nestjs/swagger'
import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Param,
  Put,
} from '@nestjs/common'
import { Roles } from '@/infra/auth/roles.decorator'
import { UpdateBudgetExpenseDto } from './dto/update-budget-expense-dto'
import { BudgetExpenseNotFound } from '@/domain/project/application/use-cases/errors/budget-expense-not-found'
import { UpdateBudgetExpenseUseCase } from '@/domain/project/application/use-cases/update-budget-expense'
import { UpdateBudgetExpenseProps } from '@/core/types/budget-expense-props'

const updateBudgetExpenseSchema = z
  .object({
    projectId: z.string(),
    title: z.string(),
    description: z.string(),
    value: z.number(),
  })
  .refine(
    (data) => {
      const keys = Object.keys(data)
      return keys.some((key) => data[key] !== undefined)
    },
    {
      message: 'Pelo menos um dos atributos deve estar presente.',
    },
  )

const bodyValidationPipe = new ZodValidationPipe(updateBudgetExpenseSchema)

@ApiTags('budget-expenses')
@Controller('/budget-expenses/update/:id')
export class UpdateBudgetExpenseController {
  constructor(private updateBudgetExpenseUseCase: UpdateBudgetExpenseUseCase) {}

  @Put()
  @HttpCode(201)
  @Roles([
    'INTERNAL_MANAGEMENT',
    'INTERNAL_PARTNERS',
    'INTERNAL_FINANCIAL_LEGAL',
  ])
  async handle(
    @Body(bodyValidationPipe) body: UpdateBudgetExpenseDto,
    @Param('id') id: string,
  ) {
    const { projectId, title, description, value } = body

    const payload: UpdateBudgetExpenseProps = {
      projectId,
      title,
      description,
      value,
    }

    const result = await this.updateBudgetExpenseUseCase.execute({
      id,
      payload,
    })

    if (result.isLeft()) {
      const error = result.value
      switch (error.constructor) {
        case BudgetExpenseNotFound:
          throw new BadRequestException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
