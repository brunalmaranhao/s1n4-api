import { UseCaseError } from '@/core/errors/use-case-error'

export class BudgetExpenseNotFound extends Error implements UseCaseError {
  constructor() {
    super(`Não foi encontrado nenhum registro de despesa pra esse id.`)
  }
}
