import { UseCaseError } from '@/core/errors/use-case-error'

export class LaunchBudgetExpenseError extends Error implements UseCaseError {
  constructor() {
    super(`A despesa excede o orçamento do projeto.`)
  }
}
