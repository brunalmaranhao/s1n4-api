import { UseCaseError } from '@/core/errors/use-case-error'

export class ExistCustomerSameCnpjError extends Error implements UseCaseError {
  constructor(identifier: string) {
    super(`Já existe um cliente com o CNPJ: ${identifier}`)
  }
}
