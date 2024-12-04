import { UseCaseError } from '@/core/errors/use-case-error'

export class ExistCustomerSameCorporateNameError
  extends Error
  implements UseCaseError
{
  constructor(identifier: string) {
    super(`Já existe um cliente com a razão social: ${identifier}`)
  }
}
