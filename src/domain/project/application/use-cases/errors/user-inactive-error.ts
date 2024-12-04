import { UseCaseError } from '@/core/errors/use-case-error'

export class UserInactiveError extends Error implements UseCaseError {
  constructor() {
    super(`Usuário Inativo. Entre em contato com o suporte.`)
  }
}
