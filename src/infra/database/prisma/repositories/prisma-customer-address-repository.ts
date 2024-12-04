import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { CustomerAddressRepository } from '@/domain/project/application/repositories/customer-address-repository'
import { CustomerAddress } from '@/domain/project/enterprise/entities/customerAddress'
import { PrismaCustomerAddressMapper } from '../mappers/prisma-customer-address-repository'

@Injectable()
export class PrismaCustomerAddressRepository
  implements CustomerAddressRepository
{
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<CustomerAddress | null> {
    const customerAddress = await this.prisma.customerAddress.findUnique({
      where: {
        id,
      },
    })

    if (!customerAddress) {
      return null
    }

    return PrismaCustomerAddressMapper.toDomain(customerAddress)
  }

  async create(customerAddress: CustomerAddress): Promise<CustomerAddress> {
    const data = PrismaCustomerAddressMapper.toPrisma(customerAddress)

    const newAddress = await this.prisma.customerAddress.create({
      data,
    })
    return PrismaCustomerAddressMapper.toDomain(newAddress)
  }

  async findByCustomerId(customerId: string): Promise<CustomerAddress | null> {
    const customerAddress = await this.prisma.customerAddress.findFirst({
      where: {
        customerId,
      },
    })

    if (!customerAddress) {
      return null
    }

    return PrismaCustomerAddressMapper.toDomain(customerAddress)
  }
}
