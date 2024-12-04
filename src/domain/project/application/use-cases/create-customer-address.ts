import { Either, left, right } from '@/core/either'
import { BadRequestException, Injectable } from '@nestjs/common'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { CustomerAddress } from '../../enterprise/entities/customerAddress'
import { CustomerAddressRepository } from '../repositories/customer-address-repository'

interface CreateCustomerAddressUseCaseRequest {
  street: string
  number: string
  complement?: string
  neighborhood: string
  city: string
  state: string
  country: string
  zipCode: string
  customerId: string
}

type CreateCustomerAddressUseCaseResponse = Either<
  BadRequestException,
  {
    customerAddress: CustomerAddress
  }
>

@Injectable()
export class CreateCustomerAddressUseCase {
  constructor(private customerAddressRepository: CustomerAddressRepository) {}

  async execute({
    street,
    city,
    country,
    customerId,
    neighborhood,
    number,
    state,
    zipCode,
    complement,
  }: CreateCustomerAddressUseCaseRequest): Promise<CreateCustomerAddressUseCaseResponse> {
    try {
      const newCustomerAddresss = CustomerAddress.create({
        customerId: new UniqueEntityID(customerId),
        city,
        country,
        neighborhood,
        number,
        state,
        street,
        zipCode,
        complement,
      })

      const customerAddressCreated =
        await this.customerAddressRepository.create(newCustomerAddresss)

      return right({
        customerAddress: customerAddressCreated,
      })
    } catch (error) {
      return left(new BadRequestException())
    }
  }
}
