import { UseCaseError } from '@/core/errors/use-case-error'

export class ExistCustomerSameNameError extends Error implements UseCaseError {
  constructor(identifier: string) {
    super(`Já existe um cliente com o nome: ${identifier}`)
  }
}
