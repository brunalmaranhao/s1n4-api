import { z } from 'zod'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'
import { ApiTags } from '@nestjs/swagger'
import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
} from '@nestjs/common'
import { Roles } from '@/infra/auth/roles.decorator'
import { CreateBudgetExpenseDto } from './dto/customer-dto'
import { CreateBudgetExpenseUseCase } from '@/domain/project/application/use-cases/create-budget-expense'
import { ProjectNotFoundError } from '@/domain/project/application/use-cases/errors/project-not-found-error'
import { LaunchBudgetExpenseError } from '@/domain/project/application/use-cases/errors/launch-budget-expense-error'

const createExpenseBodySchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  amount: z.number(),
  projectId: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(createExpenseBodySchema)

@ApiTags('budget-expense')
@Controller('/budget-expense')
export class CreateBudgetExpenseController {
  constructor(private createBudgetExpenseUseCase: CreateBudgetExpenseUseCase) {}

  @Post()
  @HttpCode(201)
  @Roles([
    'INTERNAL_MANAGEMENT',
    'INTERNAL_PARTNERS',
    'INTERNAL_FINANCIAL_LEGAL',
  ])
  async handle(@Body(bodyValidationPipe) body: CreateBudgetExpenseDto) {
    const { title, description, amount, projectId } = body

    const result = await this.createBudgetExpenseUseCase.execute({
      title,
      description,
      amount,
      projectId,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ProjectNotFoundError:
          throw new BadRequestException(error.message)
        case LaunchBudgetExpenseError:
          throw new BadRequestException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    const { budgetExpense } = result.value

    return { budgetExpenseId: budgetExpense.id.toString() }
  }
}
