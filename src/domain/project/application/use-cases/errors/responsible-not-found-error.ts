import { UseCaseError } from '@/core/errors/use-case-error'

export class ResponsiblePartiesNotFoundError
  extends Error
  implements UseCaseError
{
  constructor(identifier) {
    super(
      `Não foi encontrado registro de responsável pra esse id ${identifier}.`,
    )
  }
}
