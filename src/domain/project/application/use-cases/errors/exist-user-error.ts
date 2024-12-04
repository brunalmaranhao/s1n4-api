import { UseCaseError } from '@/core/errors/use-case-error'

export class ExistUserError extends Error implements UseCaseError {
  constructor() {
    super(`Já existe um usuário com esse e-mail.`)
  }
}
