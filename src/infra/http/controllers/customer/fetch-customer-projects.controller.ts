import { z } from 'zod'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'
import { ApiTags } from '@nestjs/swagger'
import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  NotFoundException,
  Param,
} from '@nestjs/common'
import { Roles } from '@/infra/auth/roles.decorator'
import { CustomerNotFoundError } from '@/domain/project/application/use-cases/errors/customer-not-found'
import { ProjectPresenter } from '../../presenter/project-presenter'
import { FetchCustomerProjectsUseCase } from '@/domain/project/application/use-cases/fetch-customer-projects'

@ApiTags('customer')
@Controller('/customer/:customerId/projects')
export class FetchCustomerProjectsController {
  constructor(
    private fetchCustomerProjectsUseCase: FetchCustomerProjectsUseCase,
  ) {}

  @Get()
  @HttpCode(200)
  @Roles([
    'INTERNAL_MANAGEMENT',
    'INTERNAL_PARTNERS',
    'INTERNAL_FINANCIAL_LEGAL',
  ])
  async handle(@Param('customerId') customerId: string) {
    const result = await this.fetchCustomerProjectsUseCase.execute({
      customerId,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case CustomerNotFoundError:
          throw new NotFoundException('Cliente não encontrado.')
        default:
          throw new BadRequestException()
      }
    }

    const customerProjects = result.value.projects

    const projects = customerProjects.map(ProjectPresenter.toHTTP)

    return { projects }
  }
}
