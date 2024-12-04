import { DomainEvents } from '@/core/events/domain-events'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { CustomerEditProps } from '@/core/types/customer-props'
import { CustomerRepository } from '@/domain/project/application/repositories/customer-repository'
import { Customer } from '@/domain/project/enterprise/entities/customer'
import { Status } from '@prisma/client'

export class InMemoryCustomerRepository implements CustomerRepository {
  public items: Customer[] = []

  async getCustomersWithUsers({
    page,
    size,
  }: PaginationParams): Promise<Customer[]> {
    return this.items
  }

  async findByName(name: string): Promise<Customer | null> {
    const customer = this.items.find((item) => item.name === name)

    if (!customer) {
      return null
    }

    return customer
  }

  async findByCorporateName(corporateName: string): Promise<Customer | null> {
    const customer = this.items.find(
      (item) => item.corporateName === corporateName,
    )

    if (!customer) {
      return null
    }

    return customer
  }

  async create(customer: Customer): Promise<Customer> {
    this.items.push(customer)

    DomainEvents.dispatchEventsForAggregate(customer.id)
    return customer
  }

  async findByCnpj(cnpj: string): Promise<Customer | null> {
    const customer = this.items.find((item) => item.cnpj === cnpj)

    if (!customer) {
      return null
    }

    return customer
  }

  async update(
    customerId: string,
    customer: CustomerEditProps,
  ): Promise<Customer> {
    const customerIndex = this.items.findIndex(
      (item) => item.id.toString() === customerId,
    )

    return (this.items[customerIndex] = customer as Customer)
  }

  async findById(customerId: string): Promise<Customer | null> {
    const customer = this.items.find(
      (item) => item.id.toString() === customerId,
    )

    if (!customer) {
      return null
    }

    return customer
  }

  async findAll({ page }: PaginationParams): Promise<Customer[]> {
    const customer = this.items.slice((page - 1) * 20, page * 20)

    return customer
  }

  async fetchByStatus(
    status: Status,
    { page }: PaginationParams,
  ): Promise<{ customers: Customer[]; total: number }> {
    const customers = this.items.slice((page - 1) * 20, page * 20)

    return { customers, total: customers.length }
  }

  async fetchByStatusWithoutPagination(
    status: Status,
  ): Promise<{ customers: Customer[]; total: number }> {
    const customers = this.items.filter((item) => item.status === status)

    return { customers, total: customers.length }
  }

  async remove(id: string): Promise<void> {
    const customer = this.items.find((item) => item.id.toString() === id)

    if (!customer) {
      throw new Error('Customer not found')
    }

    customer.status = 'INACTIVE'
  }
}
