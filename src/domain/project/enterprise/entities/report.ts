import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import { Status, Customer as PrismaCustomer } from '@prisma/client'
import { Customer } from './customer'

export interface ReportProps {
  name: string
  pbiWorkspaceId: string
  pbiReportId: string
  status: Status
  customerId: UniqueEntityID
  createdAt: Date
  updatedAt?: Date | null
  customer?: Customer | PrismaCustomer | null
}

export class Report extends Entity<ReportProps> {
  get customer() {
    return this.props.customer
  }

  get name() {
    return this.props.name
  }

  get pbiWorkspaceId() {
    return this.props.pbiWorkspaceId
  }

  get pbiReportId() {
    return this.props.pbiReportId
  }

  get status() {
    return this.props.status
  }

  set status(status: Status) {
    this.props.status = status
  }

  get customerId() {
    return this.props.customerId
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  get createdAt() {
    return this.props.createdAt
  }

  static create(
    props: Optional<ReportProps, 'createdAt'>,
    id?: UniqueEntityID,
  ) {
    const report = new Report(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )

    return report
  }
}
