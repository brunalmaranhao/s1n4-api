import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { ResponsiblePartiesRepository } from '../repositories/responsible-parties'
import { ResponsibleParties } from '../../enterprise/entities/responsibleParties'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ExistResponsiblePartiesError } from './errors/exist-responsible-parties'
import { ResponsiblePartiesRole } from '@prisma/client'

interface CreateResponsiblePartiesUseCaseRequest {
  firstName: string
  lastName: string
  email: string
  phone: string
  customerId: string
  birthdate: Date
  responsiblePartiesRole: ResponsiblePartiesRole[]
}

type CreateResponsiblePartiesUseCaseResponse = Either<
  ExistResponsiblePartiesError,
  {
    responsible: ResponsibleParties
  }
>

@Injectable()
export class CreateResponsiblePartiesUseCase {
  constructor(
    private responsiblePartiesRepository: ResponsiblePartiesRepository,
  ) {}

  async execute({
    email,
    firstName,
    lastName,
    birthdate,
    phone,
    customerId,
    responsiblePartiesRole,
  }: CreateResponsiblePartiesUseCaseRequest): Promise<CreateResponsiblePartiesUseCaseResponse> {
    const existResponsible =
      await this.responsiblePartiesRepository.findByEmail(email)
    if (existResponsible) {
      return left(new ExistResponsiblePartiesError())
    }

    const responsibleParties = ResponsibleParties.create({
      email,
      firstName,
      lastName,
      birthdate,
      phone,
      customerId: new UniqueEntityID(customerId),
      responsiblePartiesRole: responsiblePartiesRole ?? ['CODE'],
    })

    const responsible =
      await this.responsiblePartiesRepository.create(responsibleParties)

    return right({
      responsible,
    })
  }
}
