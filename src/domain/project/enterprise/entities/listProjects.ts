import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import { Project as PrismaProject, Status } from '@prisma/client'
import { Project } from './project'

export interface ListProjectsProps {
  name: string
  status: Status
  customerId: UniqueEntityID
  createdAt: Date
  updatedAt?: Date | null
  projects?: PrismaProject[] | Project[] | null
  order: number
  isDone: boolean
}

export class ListProjects extends Entity<ListProjectsProps> {
  get isDone() {
    return this.props.isDone
  }

  get order() {
    return this.props.order
  }

  set order(order: number) {
    this.props.order = order
  }

  get projects() {
    return this.props.projects
  }

  get customerId() {
    return this.props.customerId
  }

  get name() {
    return this.props.name
  }

  set name(name: string) {
    this.props.name = name
  }

  get status() {
    return this.props.status
  }

  set status(status: Status) {
    this.props.status = status
  }

  get updatedAt(): Date | null | undefined {
    return this.props.updatedAt
  }

  get createdAt() {
    return this.props.createdAt
  }

  static create(
    props: Optional<ListProjectsProps, 'createdAt' | 'status' | 'isDone'>,
    id?: UniqueEntityID,
  ) {
    const listProjects = new ListProjects(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
        status: props.status ?? 'ACTIVE',
        isDone: props.isDone ?? false,
      },
      id,
    )

    return listProjects
  }
}
