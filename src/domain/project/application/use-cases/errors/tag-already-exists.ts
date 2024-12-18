import { UseCaseError } from '@/core/errors/use-case-error'

export class TagAlreadyExistsError extends Error implements UseCaseError {
  constructor() {
    super(`Já existe uma tag com esse nome.`)
  }
}
