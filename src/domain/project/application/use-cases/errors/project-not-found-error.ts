import { UseCaseError } from '@/core/errors/use-case-error'

export class ProjectNotFoundError extends Error implements UseCaseError {
  constructor() {
    super(`Não existe um projeto com o id fornecido.`)
  }
}
