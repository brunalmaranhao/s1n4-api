import { faker } from '@faker-js/faker'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import {
  CustomerAddress,
  CustomerAddressProps,
} from '@/domain/project/enterprise/entities/customerAddress'
import { PrismaCustomerAddressMapper } from '@/infra/database/prisma/mappers/prisma-customer-address-repository'

export function makeCustomerAddress(
  override: Partial<CustomerAddressProps> = {},
  id?: UniqueEntityID,
) {
  const customerAddress = CustomerAddress.create(
    {
      street: faker.location.street(),
      city: faker.location.city(),
      country: faker.location.country(),
      state: faker.location.state(),
      zipCode: faker.location.zipCode(),
      neighborhood: 'bairro',
      number: '2',
      customerId: new UniqueEntityID('1'),
      ...override,
    },
    id,
  )

  return customerAddress
}

@Injectable()
export class CustomerAddressFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaCustomerAddress(
    data: Partial<CustomerAddressProps> = {},
  ): Promise<CustomerAddress> {
    const customerAddress = makeCustomerAddress(data)

    await this.prisma.customerAddress.create({
      data: PrismaCustomerAddressMapper.toPrisma(customerAddress),
    })

    return customerAddress
  }
}
