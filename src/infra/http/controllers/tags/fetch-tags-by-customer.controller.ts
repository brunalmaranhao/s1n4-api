import { ApiTags } from '@nestjs/swagger'
import { Controller, Get, HttpCode, Param } from '@nestjs/common'
import { CurrentUser } from '@/infra/auth/currrent-user.decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { Roles } from '@/infra/auth/roles.decorator'
import { FetchTagsByCustomerUseCase } from '@/domain/project/application/use-cases/fetch-tags-by-customer'
import { TagPresenter } from '../../presenter/tag-presenter'

@ApiTags('tag')
@Controller('/tags/customer/:customerId')
export class FetchTagByCustomerController {
  constructor(private fetchTagsByCustomerUseCase: FetchTagsByCustomerUseCase) {}

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
  ) {
    const result = await this.fetchTagsByCustomerUseCase.execute({
      customer: customerId,
    })

    const tags = result.value?.tags

    return { tags: tags?.map(TagPresenter.toHTTP) }
  }
}
