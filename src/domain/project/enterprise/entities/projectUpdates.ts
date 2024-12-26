import { AggregateRoot } from '@/core/entities/aggregate-root'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import {
  Customer as CustomerPrisma,
  Project as ProjectPrisma,
  Status,
  User as UserPrisma,
  Comments as PrismaComment,
} from '@prisma/client'
import { ProjectUpdateCreatedEvent } from '../../events/project-update-created-event'
import { User } from './user'
import { Project } from './project'

export type CustomerProps = CustomerPrisma & {
  users?: UserPrisma[]
}

export type ProjectProps = ProjectPrisma & {
  customer?: CustomerProps
}

export interface ProjectUpdateProps {
  description: string
  createdAt: Date
  updateAt?: Date | null
  status: Status
  projectId: UniqueEntityID
  userId: UniqueEntityID
  project?: ProjectProps | null | Project
  user?: UserPrisma | User | null
  comments?: PrismaComment[] | null
}

export class ProjectUpdate extends AggregateRoot<ProjectUpdateProps> {
  get user() {
    return this.props.user
  }

  get comments() {
    return this.props.comments
  }

  get description() {
    return this.props.description
  }

  set description(description: string) {
    this.props.description = description
  }

  get project() {
    return this.props.project
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updateAt() {
    return this.props.updateAt
  }

  get projectId() {
    return this.props.projectId
  }

  get userId() {
    return this.props.userId
  }

  get status() {
    return this.props.status
  }

  set status(status: Status) {
    this.props.status = status
  }

  static create(
    props: Optional<ProjectUpdateProps, 'createdAt' | 'status'>,
    id?: UniqueEntityID,
  ) {
    const projectUpdates = new ProjectUpdate(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
        status: props.status ?? 'ACTIVE',
      },
      id,
    )

    const inNewprojectUpdates = !id

    if (inNewprojectUpdates) {
      projectUpdates.addDomainEvent(
        new ProjectUpdateCreatedEvent(projectUpdates),
      )
    }

    return projectUpdates
  }
}
