import { UseCaseError } from '@/core/errors/use-case-error'

export class CustomerNotFoundError extends Error implements UseCaseError {
  constructor() {
    super(`Não foi encontrado nenhum registro de cliente pra esse id.`)
  }
}
