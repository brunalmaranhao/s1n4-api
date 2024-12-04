import { DomainEvents } from '@/core/events/domain-events'
import { CustomerAddressRepository } from '@/domain/project/application/repositories/customer-address-repository'
import { CustomerAddress } from '@/domain/project/enterprise/entities/customerAddress'

export class InMemoryCustomerAddressRepository
  implements CustomerAddressRepository
{
  public items: CustomerAddress[] = []

  async create(customer: CustomerAddress): Promise<CustomerAddress> {
    this.items.push(customer)

    DomainEvents.dispatchEventsForAggregate(customer.id)
    return customer
  }

  async findById(id: string): Promise<CustomerAddress | null> {
    const customer = this.items.find((item) => item.id.toString() === id)

    if (!customer) {
      return null
    }

    return customer
  }

  async findByCustomerId(customerId: string): Promise<CustomerAddress | null> {
    const customer = this.items.find(
      (item) => item.customerId.toString() === customerId,
    )

    if (!customer) {
      return null
    }

    return customer
  }
}
