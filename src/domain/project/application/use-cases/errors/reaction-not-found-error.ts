import { UseCaseError } from '@/core/errors/use-case-error'

export class ReactionNotFoundError extends Error implements UseCaseError {
  constructor() {
    super(`Reaction not found.`)
  }
}
