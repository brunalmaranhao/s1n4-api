import { UseCaseError } from '@/core/errors/use-case-error'

export class ReportAlreadyInativeError extends Error implements UseCaseError {
  constructor() {
    super(`Este relatório já foi removido.`)
  }
}
