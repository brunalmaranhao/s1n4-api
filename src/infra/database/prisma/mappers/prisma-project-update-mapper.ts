import {
  ProjectUpdates as PrismaProjectUpdates,
  Prisma,
  Project,
  User,
} from '@prisma/client'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  ProjectProps,
  ProjectUpdate,
} from '@/domain/project/enterprise/entities/projectUpdates'

type PrismaProjectUpdateProps = PrismaProjectUpdates & {
  project?: ProjectProps
  user: User
}
export class PrismaProjectUpdateMapper {
  static toDomainWithProject(raw: PrismaProjectUpdateProps): ProjectUpdate {
    return ProjectUpdate.create(
      {
        description: raw.description,
        projectId: new UniqueEntityID(raw.projectId),
        userId: new UniqueEntityID(raw.userId),
        project: raw.project,
        user: raw.user,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toDomain(raw: PrismaProjectUpdates): ProjectUpdate {
    return ProjectUpdate.create(
      {
        description: raw.description,
        projectId: new UniqueEntityID(raw.projectId),
        userId: new UniqueEntityID(raw.userId),
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(
    update: ProjectUpdate,
  ): Prisma.ProjectUpdatesUncheckedCreateInput {
    return {
      id: update.id.toString(),
      description: update.description,
      userId: update.userId.toString(),
      projectId: update.projectId.toString(),
      createdAt: update.createdAt,
      updatedAt: update.updateAt,
      status: update.status,
    }
  }
}
