import { faker } from '@faker-js/faker'
import { randomUUID } from 'node:crypto'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import {
  Customer,
  CustomerProps,
} from '@/domain/project/enterprise/entities/customer'
import { PrismaCustomerMapper } from '@/infra/database/prisma/mappers/prisma-customer-mapper'

export function makeCustomer(
  override: Partial<CustomerProps> = {},
  id?: UniqueEntityID,
) {
  const customer = Customer.create(
    {
      name: randomUUID(),
      corporateName: randomUUID(),
      cnpj: randomUUID(),
      ...override,
    },
    id,
  )

  return customer
}

@Injectable()
export class CustomerFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaCustomer(
    data: Partial<CustomerProps> = {},
  ): Promise<Customer> {
    const customer = makeCustomer(data)

    await this.prisma.customer.create({
      data: PrismaCustomerMapper.toPrisma(customer),
    })

    return customer
  }
}
