import { UseCaseError } from '@/core/errors/use-case-error'

export class ProjectUpdatesNotFoundError extends Error implements UseCaseError {
  constructor() {
    super(`Não existe uma atualização do projeto com o id fornecido.`)
  }
}
