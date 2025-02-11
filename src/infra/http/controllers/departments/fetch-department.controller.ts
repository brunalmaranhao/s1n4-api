import { ApiTags } from '@nestjs/swagger'
import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Query,
} from '@nestjs/common'
import { Roles } from '@/infra/auth/roles.decorator'
import { FetchDepartmentsUseCase } from '@/domain/project/application/use-cases/fetch-departments'
import { DepartmentPresenter } from '../../presenter/department'

@ApiTags('departments')
@Controller('/departments')
export class FetchDepartmentController {
  constructor(private fetchDepartmentsUseCase: FetchDepartmentsUseCase) {}

  @Get()
  @HttpCode(200)
  @Roles([
    'INTERNAL_MANAGEMENT',
    'INTERNAL_PARTNERS',
    'INTERNAL_FINANCIAL_LEGAL',
  ])
  async handle() {
    const result = await this.fetchDepartmentsUseCase.execute()

    if (result.isRight()) {
      const { departments: response } = result.value

      const departments = response.map(DepartmentPresenter.toHTTP)

      return { departments }
    }
  }
}
