import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { UserRepository } from '../repositories/user-repository'
import { User } from '../../enterprise/entities/user'
import { ExistUserError } from './errors/exist-user-error'
import { UserRoles } from '@prisma/client'
import { HashGenerator } from '../cryptography/hash-generator'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

interface CreateUserUseCaseRequest {
  firstName: string
  lastName: string
  email: string
  role: UserRoles
  customerId?: string
  password: string
  departmentId?: string
}

type CreateUserUseCaseResponse = Either<
  ExistUserError,
  {
    user: User
  }
>

@Injectable()
export class CreateUserUseCase {
  constructor(
    private userRepository: UserRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    email,
    firstName,
    lastName,
    role,
    password,
    customerId,
    departmentId,
  }: CreateUserUseCaseRequest): Promise<CreateUserUseCaseResponse> {
    const existUser = await this.userRepository.findByEmail(email)
    if (existUser) {
      return left(new ExistUserError())
    }

    const hashedPassword = await this.hashGenerator.hash(password)
    const user = User.create({
      email,
      firstName,
      lastName,
      password: hashedPassword,
      departmentId: departmentId ? new UniqueEntityID(departmentId) : null,
      role,
      customerId: customerId ? new UniqueEntityID(customerId) : null,
    })

    const newUser = await this.userRepository.create(user)

    return right({
      user: newUser,
    })
  }
}
