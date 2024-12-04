import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

export interface CustomerAddressProps {
  street: string
  number: string
  complement?: string | null
  neighborhood: string
  city: string
  state: string
  country: string
  zipCode: string
  customerId: UniqueEntityID
  createdAt: Date
  updatedAt?: Date | null
}

export class CustomerAddress extends Entity<CustomerAddressProps> {
  get updatedAt() {
    return this.props.updatedAt
  }

  get createdAt() {
    return this.props.createdAt
  }

  get street() {
    return this.props.street
  }

  get number() {
    return this.props.number
  }

  get complement() {
    return this.props.complement
  }

  get neighborhood() {
    return this.props.neighborhood
  }

  get zipCode() {
    return this.props.zipCode
  }

  get city() {
    return this.props.city
  }

  get state() {
    return this.props.state
  }

  get country() {
    return this.props.country
  }

  get customerId() {
    return this.props.customerId
  }

  static create(
    props: Optional<CustomerAddressProps, 'createdAt'>,
    id?: UniqueEntityID,
  ) {
    const customerAddress = new CustomerAddress(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )

    return customerAddress
  }
}
