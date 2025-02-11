import { z } from 'zod'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'
import { ApiTags } from '@nestjs/swagger'
import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
} from '@nestjs/common'
import { Roles } from '@/infra/auth/roles.decorator'
import { CreateUserUseCase } from '@/domain/project/application/use-cases/create-user'
import { ExistUserError } from '@/domain/project/application/use-cases/errors/exist-user-error'
import { CreateInternalUserDto } from './dto/create-internal-user-dto'
const UserRole = z.enum([
  'INTERNAL_PARTNERS',
  'INTERNAL_FINANCIAL_LEGAL',
  'INTERNAL_MANAGEMENT',
])

const createUserBodySchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  password: z.string(),
  role: UserRole,
})

const bodyValidationPipe = new ZodValidationPipe(createUserBodySchema)

@ApiTags('user')
@Controller('/user/internal')
export class CreateInternalUserController {
  constructor(private createUserUseCase: CreateUserUseCase) {}

  @Post()
  @HttpCode(201)
  @Roles(['INTERNAL_MANAGEMENT'])
  async handle(@Body(bodyValidationPipe) body: CreateInternalUserDto) {
    const { firstName, lastName, email, password, role, departmentId } = body

    const result = await this.createUserUseCase.execute({
      firstName,
      lastName,
      email,
      password,
      role,
      departmentId,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ExistUserError:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    const { user } = result.value

    return { user }
  }
}
