import { ApiTags } from '@nestjs/swagger'
import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  Param,
} from '@nestjs/common'
import { Roles } from '@/infra/auth/roles.decorator'
import { CustomerPresenterAllFields } from '../../presenter/customer-presenter-all-fields'
import { ResponsiblePartiesNotFoundError } from '@/domain/project/application/use-cases/errors/responsible-not-found-error'
import { ResponsiblePartiesPresenter } from '../../presenter/responsible-parties'
import { FetchResponsiblePartiesByIdUseCase } from '@/domain/project/application/use-cases/fetch-responsible-parties-by-id'

@ApiTags('responsible-parties')
@Controller('/responsible-parties/id/:id')
export class FetchResponsiblePartiesByIdController {
  constructor(
    private fetchResponsiblePartiesByIdUseCase: FetchResponsiblePartiesByIdUseCase,
  ) {}

  @Get()
  @HttpCode(200)
  @Roles([
    'INTERNAL_MANAGEMENT',
    'INTERNAL_PARTNERS',
    'INTERNAL_FINANCIAL_LEGAL',
  ])
  async handle(@Param('id') id: string) {
    const result = await this.fetchResponsiblePartiesByIdUseCase.execute({
      id,
    })

    if (result.isLeft()) {
      const error = result.value
      switch (error.constructor) {
        case ResponsiblePartiesNotFoundError:
          throw new BadRequestException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    const responsible = ResponsiblePartiesPresenter.toHTTP(
      result.value.responsible,
    )

    return { responsible }
  }
}
