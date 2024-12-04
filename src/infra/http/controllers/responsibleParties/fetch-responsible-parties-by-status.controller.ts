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
import { Status } from '@prisma/client'
import { FetchResponsiblePartiesByStatusUseCase } from '@/domain/project/application/use-cases/fetch-responsible-parties-by-status'
import { ResponsiblePartiesPresenter } from '../../presenter/responsible-parties'

const pageQueryParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>

@ApiTags('responsible-parties')
@Controller('/responsible-parties/:status')
export class FetchResponsiblePartiesController {
  constructor(
    private fetchResponsiblePartiesByStatusUseCase: FetchResponsiblePartiesByStatusUseCase,
  ) {}

  @Get()
  @HttpCode(200)
  @Roles([
    'INTERNAL_MANAGEMENT',
    'INTERNAL_PARTNERS',
    'INTERNAL_FINANCIAL_LEGAL',
  ])
  async handle(
    @Query('page', queryValidationPipe) page: PageQueryParamSchema,
    @Param('status') status: string,
  ) {
    if (status !== 'active' && status !== 'inactive') {
      throw new BadRequestException('Especifique um status válido.')
    }

    const parsedStatus = status.toLocaleUpperCase() as Status
    const result = await this.fetchResponsiblePartiesByStatusUseCase.execute({
      page,
      status: parsedStatus,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const responsibleParties = result.value.responsible

    const response = responsibleParties.map(ResponsiblePartiesPresenter.toHTTP)

    return { responsibleParties: response }
  }
}
