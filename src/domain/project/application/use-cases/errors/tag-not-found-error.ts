import { UseCaseError } from '@/core/errors/use-case-error'

export class TagNotFoundError extends Error implements UseCaseError {
  constructor() {
    super(`Tag não encontrada.`)
  }
}
