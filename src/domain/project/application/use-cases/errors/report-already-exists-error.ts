import { UseCaseError } from '@/core/errors/use-case-error'

export class ReportAlreadyExistsError extends Error implements UseCaseError {
  constructor() {
    super(`Esse relatório já foi adicionado.`)
  }
}
