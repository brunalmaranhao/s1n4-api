import {
  CustomerAddress as PrismaCustomerAddress,
  Prisma,
} from '@prisma/client'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { CustomerAddress } from '@/domain/project/enterprise/entities/customerAddress'

export class PrismaCustomerAddressMapper {
  static toDomain(raw: PrismaCustomerAddress): CustomerAddress {
    return CustomerAddress.create(
      {
        street: raw.street,
        state: raw.state,
        city: raw.city,
        country: raw.country,
        complement: raw.complement,
        neighborhood: raw.neighborhood,
        number: raw.number,
        customerId: new UniqueEntityID(raw.customerId),
        zipCode: raw.zipCode,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(
    customerAddress: CustomerAddress,
  ): Prisma.CustomerAddressUncheckedCreateInput {
    return {
      id: customerAddress.id.toString(),
      street: customerAddress.street,
      state: customerAddress.state,
      city: customerAddress.city,
      country: customerAddress.country,
      complement: customerAddress.complement,
      neighborhood: customerAddress.neighborhood,
      number: customerAddress.number,
      customerId: customerAddress.customerId.toString(),
      zipCode: customerAddress.zipCode,
      createdAt: customerAddress.createdAt,
    }
  }
}
