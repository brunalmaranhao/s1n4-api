import { ApiTags } from '@nestjs/swagger'
import { Controller, Get, HttpCode } from '@nestjs/common'
import { Roles } from '@/infra/auth/roles.decorator'
import { CountUsersAndCustomersUseCase } from '@/domain/project/application/use-cases/count-users-and-customers'

@ApiTags('customer')
@Controller('/customer/count')
export class CountUsersAndCustomersController {
  constructor(
    private countCustomersAndUsersUseCase: CountUsersAndCustomersUseCase,
  ) {}

  @Get()
  @HttpCode(200)
  @Roles([
    'INTERNAL_MANAGEMENT',
    'INTERNAL_PARTNERS',
    'INTERNAL_FINANCIAL_LEGAL',
  ])
  async handle() {
    const result = await this.countCustomersAndUsersUseCase.execute()
    // console.log(result)
    return {
      totalCustomers: result.value?.totalCustomers,
      totalUsers: result.value?.totalUsers,
    }
  }
}
