import {
  ProjectUpdates as PrismaProjectUpdates,
  Prisma,
  Project,
  Comments as PrismaComment,
  Reaction as PrismaReaction,
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
  comments?: PrismaComment[] | null
  reactions?: PrismaReaction[] | null
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
        comments: raw.comments,
        createdAt: raw.createdAt,
        updateAt: raw.updatedAt,
        reactions: raw.reactions,
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
        createdAt: raw.createdAt,
        updateAt: raw.updatedAt,
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
