import { UseCaseError } from '@/core/errors/use-case-error'

export class ReportNotFoundError extends Error implements UseCaseError {
  constructor(identifier) {
    super(`Não foi encontrado relatório pra esse id ${identifier}.`)
  }
}
