import { ApiTags } from '@nestjs/swagger'
import { BadRequestException, Controller, Get, HttpCode } from '@nestjs/common'
import { Roles } from '@/infra/auth/roles.decorator'
import { ResponsiblePartiesPresenter } from '../../presenter/responsible-parties'
import { FetchActiveResponsiblePartiesUseCase } from '@/domain/project/application/use-cases/fetch-active-responsible-parties'

@ApiTags('responsible-parties')
@Controller('/responsible-parties/all')
export class FetchActivesReponsiblesController {
  constructor(
    private fetchActiveResponsiblePartiesUseCase: FetchActiveResponsiblePartiesUseCase,
  ) {}

  @Get()
  @HttpCode(200)
  @Roles([
    'INTERNAL_MANAGEMENT',
    'INTERNAL_PARTNERS',
    'INTERNAL_FINANCIAL_LEGAL',
  ])
  async handle() {
    const result = await this.fetchActiveResponsiblePartiesUseCase.execute()
    // console.log(result)

    if (result.isLeft()) {
      throw new BadRequestException('Erro')
    }

    const responsibleParties = result.value.responsible

    const responsiblesPresenter = responsibleParties.map(
      ResponsiblePartiesPresenter.toHTTP,
    )

    return { responsibles: responsiblesPresenter }
  }
}
