import { z } from 'zod'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'
import { ApiTags } from '@nestjs/swagger'
import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  Query,
} from '@nestjs/common'
import { Roles } from '@/infra/auth/roles.decorator'
import { FetchBudgetsExpenseUseCase } from '@/domain/project/application/use-cases/fetch-budgets-expense'
import { BudgetExpensePresenter } from '../../presenter/budget-expense'

const pageQueryParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))

const sizeQueryParamSchema = z
  .string()
  .optional()
  .default('10')
  .transform(Number)
  .pipe(z.number().min(5))

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>

const querySizeValidationPipe = new ZodValidationPipe(sizeQueryParamSchema)

type SizeQueryParamSchema = z.infer<typeof sizeQueryParamSchema>

@ApiTags('budget-expense')
@Controller('/budget-expense')
export class FetchBudgetExpenseController {
  constructor(private fetchBudgetExpenseUseCase: FetchBudgetsExpenseUseCase) {}

  @Get()
  @HttpCode(200)
  @Roles([
    'INTERNAL_MANAGEMENT',
    'INTERNAL_PARTNERS',
    'INTERNAL_FINANCIAL_LEGAL',
  ])
  async handle(
    @Query('page', queryValidationPipe) page: PageQueryParamSchema,
    @Query('size', querySizeValidationPipe) size: SizeQueryParamSchema,
  ) {
    const result = await this.fetchBudgetExpenseUseCase.execute({
      page,
      size,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const budgetExpenses = result.value.budgetExpenses

    const response = budgetExpenses.map(BudgetExpensePresenter.toHTTP)

    return { data: response, total: result.value.total }
  }
}
