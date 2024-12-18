import { ApiTags } from '@nestjs/swagger'
import { Controller, Get, HttpCode, Param } from '@nestjs/common'
import { CurrentUser } from '@/infra/auth/currrent-user.decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { Roles } from '@/infra/auth/roles.decorator'
import { TagPresenter } from '../../presenter/tag-presenter'
import { SearchTagByNameAndCustomerUseCase } from '@/domain/project/application/use-cases/search-tag-by-name-and-customer'

@ApiTags('tag')
@Controller('/tags/search/customer/:customerId/name/:name')
export class SearchTagByCustomerController {
  constructor(
    private searchTagByNameAndCustomerUseCase: SearchTagByNameAndCustomerUseCase,
  ) {}

  @Get()
  @HttpCode(200)
  @Roles([
    'INTERNAL_MANAGEMENT',
    'INTERNAL_PARTNERS',
    'INTERNAL_FINANCIAL_LEGAL',
  ])
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('customerId') customerId: string,
    @Param('name') name: string,
  ) {
    const result = await this.searchTagByNameAndCustomerUseCase.execute({
      customerId,
      name,
    })

    const tags = result.value?.tags

    return { tags: tags?.map(TagPresenter.toHTTP) }
  }
}
