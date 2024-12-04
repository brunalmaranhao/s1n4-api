import { z } from 'zod'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'
import { ApiTags } from '@nestjs/swagger'
import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  Query,
} from '@nestjs/common'
import { Roles } from '../../../auth/roles.decorator'

import { ResponsiblePartiesPresenter } from '../../presenter/responsible-parties'
import { FetchResponsibleBirthdaysOfTheMonthUseCase } from '@/domain/project/application/use-cases/fetch-responsible-birthdays-of-the-month'

const pageQueryParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>

@ApiTags('responsible-parties')
@Controller('/responsible-parties/birthdays-of-the-month')
export class FetchResponsibleBirthdaysOfTheMonthController {
  constructor(
    private fetchResponsibleBirthdaysOfTheMonthUseCase: FetchResponsibleBirthdaysOfTheMonthUseCase,
  ) {}

  @Get()
  @HttpCode(200)
  @Roles([
    'INTERNAL_MANAGEMENT',
    'INTERNAL_PARTNERS',
    'INTERNAL_FINANCIAL_LEGAL',
  ])
  async handle(@Query('page', queryValidationPipe) page: PageQueryParamSchema) {
    const result =
      await this.fetchResponsibleBirthdaysOfTheMonthUseCase.execute({
        page,
      })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const responsibleParties = result.value.responsiblesBirthdayOfTheMonth

    const responsiblesBirthdayOfTheMonth = responsibleParties.map(
      ResponsiblePartiesPresenter.toHTTP,
    )

    return { responsiblesBirthdayOfTheMonth }
  }
}
