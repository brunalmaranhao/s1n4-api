import { UseCaseError } from '@/core/errors/use-case-error'

export class ListProjectNotFoundError extends Error implements UseCaseError {
  constructor() {
    super(`Não existe uma lista de projetos com o id fornecido.`)
  }
}
