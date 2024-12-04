import { UseCaseError } from '@/core/errors/use-case-error'

export class ProjectAlreadyExistsError extends Error implements UseCaseError {
  constructor() {
    super(`Já existe um projeto com esse nome.`)
  }
}
