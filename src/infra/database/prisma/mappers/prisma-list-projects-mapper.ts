import {
  ListProjects as PrismaListProjects,
  Prisma,
  Project,
} from '@prisma/client'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ListProjects } from '@/domain/project/enterprise/entities/listProjects'

type PrismaListProjectsProps = PrismaListProjects & {
  projects?: Project[]
}
export class PrismaListProjectsMapper {
  static toDomainWithProjects(raw: PrismaListProjectsProps): ListProjects {
    return ListProjects.create(
      {
        name: raw.name,
        status: raw.status,
        customerId: new UniqueEntityID(raw.customerId),
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
        projects: raw.projects,
        order: raw.order,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toDomain(raw: PrismaListProjects): ListProjects {
    return ListProjects.create(
      {
        name: raw.name,
        status: raw.status,
        customerId: new UniqueEntityID(raw.customerId),
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
        order: raw.order,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(
    listProjects: ListProjects,
  ): Prisma.ListProjectsUncheckedCreateInput {
    return {
      id: listProjects.id.toString(),
      name: listProjects.name,
      status: listProjects.status,
      customerId: listProjects.customerId.toString(),
      createdAt: listProjects.createdAt,
      updatedAt: listProjects.updatedAt,
      order: listProjects.order,
    }
  }
}
