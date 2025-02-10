import { UseCaseError } from '@/core/errors/use-case-error'

export class ListProjectCannotBeEditedError
  extends Error
  implements UseCaseError
{
  constructor() {
    super(`Essa lista não pode ser editada.`)
  }
}
