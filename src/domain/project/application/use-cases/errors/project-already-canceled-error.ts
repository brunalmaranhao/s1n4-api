import { UseCaseError } from '@/core/errors/use-case-error'

export class ProjectAlreadyCanceledError extends Error implements UseCaseError {
  constructor() {
    super(`Este projeto já foi removido.`)
  }
}
