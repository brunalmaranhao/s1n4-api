import { UseCaseError } from '@/core/errors/use-case-error'

export class UpdatePasswordError extends Error implements UseCaseError {
  constructor() {
    super(`Update password error.`)
  }
}
