import { ApiTags } from '@nestjs/swagger'
import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  NotFoundException,
} from '@nestjs/common'
import { CustomerNotFoundError } from '@/domain/project/application/use-cases/errors/customer-not-found'
import { ProjectPresenter } from '../../presenter/project-presenter'
import { CurrentUser } from '@/infra/auth/currrent-user.decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { FetchCustomerProjectsByUserUseCase } from '@/domain/project/application/use-cases/fetch-customer-projects-by-user'

@ApiTags('project')
@Controller('/projects/customer')
export class FetchCustomerProjectsByUserController {
  constructor(
    private fetchCustomerProjectsByUserUseCase: FetchCustomerProjectsByUserUseCase,
  ) {}

  @Get()
  @HttpCode(200)
  async handle(@CurrentUser() user: UserPayload) {
    const result = await this.fetchCustomerProjectsByUserUseCase.execute({
      userId: user.sub,
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
