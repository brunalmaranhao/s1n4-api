import { faker } from '@faker-js/faker'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import {
  ProjectUpdate,
  ProjectUpdateProps,
} from '@/domain/project/enterprise/entities/projectUpdates'
import { PrismaProjectUpdateMapper } from '@/infra/database/prisma/mappers/prisma-project-update-mapper'

export function makeProjectUpdates(
  override: Partial<ProjectUpdateProps> = {},
  id?: UniqueEntityID,
) {
  const project = ProjectUpdate.create(
    {
      description: faker.company.buzzPhrase(),
      userId: new UniqueEntityID('12'),
      projectId: new UniqueEntityID('12'),
      createdAt: new Date(),
      ...override,
    },
    id,
  )

  return project
}

@Injectable()
export class ProjectUpdatesFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaProject(
    data: Partial<ProjectUpdateProps> = {},
  ): Promise<ProjectUpdate> {
    const project = makeProjectUpdates(data)

    await this.prisma.projectUpdates.create({
      data: PrismaProjectUpdateMapper.toPrisma(project),
    })

    return project
  }
}
