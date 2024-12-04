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
import { FetchUsersByStatusUseCase } from '@/domain/project/application/use-cases/fetch-users-by-status'
import { UserPresenter } from '../../presenter/user-presenter'

const pageQueryParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>

@ApiTags('user')
@Controller('/user/:status')
export class FetchUsersController {
  constructor(private fetchUsersByStatusUseCase: FetchUsersByStatusUseCase) {}

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
    const result = await this.fetchUsersByStatusUseCase.execute({
      page,
      status: parsedStatus,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const users = result.value.users

    const response = users.map(UserPresenter.toHTTP)

    return { users: response }
  }
}
