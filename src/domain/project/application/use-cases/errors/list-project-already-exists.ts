import { UseCaseError } from '@/core/errors/use-case-error'

export class ListProjectAlreadyExistsError
  extends Error
  implements UseCaseError
{
  constructor() {
    super(`Já existe uma lista de projeto com esse nome.`)
  }
}
