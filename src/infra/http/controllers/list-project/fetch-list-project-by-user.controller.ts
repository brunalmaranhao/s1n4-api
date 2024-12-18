import { ApiTags } from '@nestjs/swagger'
import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  NotFoundException,
} from '@nestjs/common'
import { CurrentUser } from '@/infra/auth/currrent-user.decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { ListProjectPresenter } from '../../presenter/list-project-presenter'
import { FetchListProjectsByUserUseCase } from '@/domain/project/application/use-cases/fetch-list-projects-by-user'
import { UserNotFoundError } from '@/domain/project/application/use-cases/errors/user-not-found-error'
import { Project } from '@prisma/client'

@ApiTags('list-project')
@Controller('/list-project')
export class FetchListProjectByUserController {
  constructor(
    private fetchListProjectsByUserUseCase: FetchListProjectsByUserUseCase,
  ) {}

  @Get()
  @HttpCode(200)
  async handle(@CurrentUser() user: UserPayload) {
    const result = await this.fetchListProjectsByUserUseCase.execute({
      userId: user.sub,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case UserNotFoundError:
          throw new NotFoundException('Usuário não encontrado.')
        default:
          throw new BadRequestException()
      }
    }

    const listProjects = result.value.listProjects
    const listProjectPresenter = listProjects
      .map(ListProjectPresenter.toHTTP)
      .map((item) => ({
        ...item,
        projects: item.projects?.map((itemProject) => {
          return {
            id: itemProject.id.toString(),
            name: itemProject.name,
            status: itemProject.status,
            deadline: itemProject.deadline,
            customer: itemProject.customer,
            tags: itemProject.tags,
            listProjects: itemProject.listProjects,
            budget: itemProject.budget,
            customerId: itemProject.customerId.toString(),
            ...(itemProject.shouldShowInformationsToCustomerUser && {
              updatedListProjectAt: itemProject.updatedListProjectAt,
            }),
          }
        }),
      }))

    return { listProjects: listProjectPresenter }
  }
}
