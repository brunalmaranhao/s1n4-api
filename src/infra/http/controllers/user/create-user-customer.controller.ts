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
import { CreateCustomerDto } from './dto/create-user-dto'
import { ExistUserError } from '@/domain/project/application/use-cases/errors/exist-user-error'
import { Public } from '@/infra/auth/public'
const UserRole = z.enum(['CLIENT_RESPONSIBLE', 'CLIENT_OWNER', 'CLIENT_USER'])

const createUserBodySchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  password: z.string(),
  customerId: z.string(),
  role: UserRole,
})

const bodyValidationPipe = new ZodValidationPipe(createUserBodySchema)

@ApiTags('user')
@Controller('/user')
export class CreateUserController {
  constructor(private createUserUseCase: CreateUserUseCase) {}

  @Post()
  @HttpCode(201)
  @Roles([
    'INTERNAL_MANAGEMENT',
    'INTERNAL_PARTNERS',
    'INTERNAL_FINANCIAL_LEGAL',
  ])
  async handle(@Body(bodyValidationPipe) body: CreateCustomerDto) {
    const { firstName, lastName, email, password, role, customerId } = body

    const result = await this.createUserUseCase.execute({
      firstName,
      lastName,
      email,
      password,
      role,
      customerId,
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

    return { userId: user.id.toString() }
  }
}
