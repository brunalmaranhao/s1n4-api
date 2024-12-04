import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Param,
  Put,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { ApiTags } from '@nestjs/swagger'
import { Roles } from '@/infra/auth/roles.decorator'
import { UpdateUserUseCase } from '@/domain/project/application/use-cases/update-user'
import { UpdateUserDto } from './dto/update-user-dto'
import { UserEditProps } from '@/core/types/user-props'
import { UserNotFoundError } from '@/domain/project/application/use-cases/errors/user-not-found-error'

const UserRole = z.enum(['CLIENT_RESPONSIBLE', 'CLIENT_OWNER', 'CLIENT_USER'])

const updateUserBodySchema = z
  .object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    role: UserRole.optional(),
  })
  .refine(
    (data) => {
      const keys = Object.keys(data)
      return keys.some((key) => data[key] !== undefined)
    },
    {
      message: 'Pelo menos um dos atributos deve estar presente.',
    },
  )

const bodyValidationPipe = new ZodValidationPipe(updateUserBodySchema)

@ApiTags('user')
@Controller('/user/update/:id')
export class UpdateUserController {
  constructor(private updateUserUseCase: UpdateUserUseCase) {}

  @Put()
  @HttpCode(201)
  @Roles([
    'INTERNAL_MANAGEMENT',
    'INTERNAL_PARTNERS',
    'INTERNAL_FINANCIAL_LEGAL',
  ])
  async handle(
    @Body(bodyValidationPipe) body: UpdateUserDto,
    @Param('id') id: string,
  ) {
    const { firstName, lastName, role } = body

    const payload: UserEditProps = {
      firstName,
      lastName,
      role,
    }

    const result = await this.updateUserUseCase.execute({
      id,
      user: payload,
    })

    if (result.isLeft()) {
      const error = result.value
      switch (error.constructor) {
        case UserNotFoundError:
          throw new BadRequestException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
