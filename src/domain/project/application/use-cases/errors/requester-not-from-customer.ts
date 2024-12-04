import { UseCaseError } from '@/core/errors/use-case-error'

export class RequesterNotFromCustomer extends Error implements UseCaseError {
  constructor() {
    super(`Usuário não tem permissão para acessar os relatórios deste cliente.`)
  }
}
