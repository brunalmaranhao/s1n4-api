import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import { StatusProject, Customer as PrismaCustomer } from '@prisma/client'
import { Customer } from './customer'

export interface ProjectProps {
  name: string
  deadline?: Date | null
  statusProject: StatusProject
  customerId: UniqueEntityID
  createdAt: Date
  updatedAt?: Date | null
  customer?: Customer | PrismaCustomer | null
  budget?: number | null
}

export class Project extends Entity<ProjectProps> {
  get customer() {
    return this.props.customer
  }

  get budget() {
    return this.props.budget
  }

  get customerId() {
    return this.props.customerId
  }

  set customerId(customerId) {
    this.props.customerId = customerId
  }

  get name() {
    return this.props.name
  }

  set name(name: string) {
    this.props.name = name
  }

  get deadline(): Date | null | undefined {
    return this.props.deadline
  }

  set deadline(deadline: Date | null) {
    this.props.deadline = deadline
  }

  get statusProject() {
    return this.props.statusProject
  }

  set statusProject(statusProject: StatusProject) {
    this.props.statusProject = statusProject
  }

  get updatedAt(): Date | null | undefined {
    return this.props.updatedAt
  }

  set updatedAt(updatedAt: Date) {
    this.props.updatedAt = updatedAt
  }

  get createdAt() {
    return this.props.createdAt
  }

  static create(
    props: Optional<ProjectProps, 'createdAt' | 'statusProject' | 'budget'>,
    id?: UniqueEntityID,
  ) {
    const project = new Project(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
        statusProject: props.statusProject ?? 'WAITING',
        budget: props.budget ?? 0,
      },
      id,
    )

    return project
  }
}
