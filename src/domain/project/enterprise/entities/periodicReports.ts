import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import { Customer, Project as PrismaProject, Status } from '@prisma/client'
import { Project } from './project'

export type ProjectProps = PrismaProject & {
  customer?: Customer
}

export interface PeriodicReportProps {
  name: string
  month: string
  year: string
  url: string
  projectId: UniqueEntityID
  project?: Project | PrismaProject | ProjectProps | null
  status: Status
  createdAt?: Date
  updatedAt?: Date | null
}

export class PeriodicReport extends Entity<PeriodicReportProps> {
  get updatedAt() {
    return this.props.updatedAt
  }

  get createdAt() {
    return this.props.createdAt
  }

  get project() {
    return this.props.project
  }

  get name() {
    return this.props.name
  }

  get month() {
    return this.props.month
  }

  get year() {
    return this.props.year
  }

  get url() {
    return this.props.url
  }

  get projectId() {
    return this.props.projectId
  }

  get status() {
    return this.props.status
  }

  static create(
    props: Optional<PeriodicReportProps, 'status' | 'createdAt'>,
    id?: UniqueEntityID,
  ) {
    const periodicReport = new PeriodicReport(
      {
        ...props,
        status: props.status ?? 'ACTIVE',
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )

    return periodicReport
  }
}
