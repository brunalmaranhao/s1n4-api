import { PaginationParams } from '@/core/repositories/pagination-params'
import { Customer } from '../../enterprise/entities/customer'
import { CustomerEditProps } from '@/core/types/customer-props'
import { Status } from '@prisma/client'

export abstract class CustomerRepository {
  abstract create(customer: Customer): Promise<Customer>
  abstract findById(customerId: string): Promise<Customer | null>
  abstract findAll({ page, size }: PaginationParams): Promise<Customer[]>

  abstract update(
    customerId: string,
    customer: CustomerEditProps,
  ): Promise<Customer>

  abstract findByCnpj(cpnj: string): Promise<Customer | null>
  abstract findByName(name: string): Promise<Customer | null>
  abstract findByCorporateName(corporateName: string): Promise<Customer | null>
  abstract fetchByStatus(
    status: Status,
    params: PaginationParams,
  ): Promise<{ customers: Customer[]; total: number }>

  abstract fetchByStatusWithoutPagination(
    status: Status,
  ): Promise<{ customers: Customer[]; total: number }>

  abstract remove(id: string): Promise<void>
  abstract getCustomersWithUsers({
    page,
    size,
  }: PaginationParams): Promise<Customer[]>

  abstract countActiveCustomers(): Promise<number>
}
