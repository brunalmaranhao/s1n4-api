import { z } from 'zod'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'
import { ApiTags } from '@nestjs/swagger'
import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  Param,
  Query,
} from '@nestjs/common'
import { Roles } from '@/infra/auth/roles.decorator'
import { ResponsiblePartiesPresenter } from '../../presenter/responsible-parties'
import { FetchResponsibleBirthdaysOfTheDayUseCase } from '@/domain/project/application/use-cases/fetch-responsible-birthdays-of-the-day'

const pageQueryParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>

@ApiTags('responsible-parties')
@Controller('/responsible-parties/birthdays-of-the-day')
export class FetchResponsibleBirthdaysOfTheDayController {
  constructor(
    private fetchResponsibleBirthdaysOfTheDayUseCase: FetchResponsibleBirthdaysOfTheDayUseCase,
  ) {}

  @Get()
  @HttpCode(200)
  @Roles([
    'INTERNAL_MANAGEMENT',
    'INTERNAL_PARTNERS',
    'INTERNAL_FINANCIAL_LEGAL',
  ])
  async handle(@Query('page', queryValidationPipe) page: PageQueryParamSchema) {
    const result = await this.fetchResponsibleBirthdaysOfTheDayUseCase.execute({
      page,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const responsibleParties = result.value.responsiblesBirthday

    const responsiblesBirthday = responsibleParties.map(
      ResponsiblePartiesPresenter.toHTTP,
    )

    return { responsiblesBirthday }
  }
}
