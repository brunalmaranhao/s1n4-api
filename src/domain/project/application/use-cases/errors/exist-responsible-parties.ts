import { UseCaseError } from '@/core/errors/use-case-error'

export class ExistResponsiblePartiesError
  extends Error
  implements UseCaseError
{
  constructor() {
    super(`Já existe um reponsável com esse email.`)
  }
}
