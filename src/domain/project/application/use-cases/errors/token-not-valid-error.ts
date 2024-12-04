import { UseCaseError } from '@/core/errors/use-case-error'

export class TokenNotValidFoundError extends Error implements UseCaseError {
  constructor(message?: string) {
    super(`Token not valid. ${message && 'Message: ' + message}`)
  }
}
