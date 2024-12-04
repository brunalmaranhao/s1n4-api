import { CustomerAddress } from '../../enterprise/entities/customerAddress'

export abstract class CustomerAddressRepository {
  abstract create(customerAddress: CustomerAddress): Promise<CustomerAddress>
  abstract findById(customerAddressId: string): Promise<CustomerAddress | null>
  abstract findByCustomerId(customerId: string): Promise<CustomerAddress | null>
}
