import { faker } from '@faker-js/faker'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import {
  Project,
  ProjectProps,
} from '@/domain/project/enterprise/entities/project'
import { PrismaProjectMapper } from '@/infra/database/prisma/mappers/prisma-project-mapper'

export function makeProject(
  override: Partial<ProjectProps> = {},
  id?: UniqueEntityID,
) {
  const project = Project.create(
    {
      name: faker.company.name(),
      deadline: faker.date.future(),
      statusProject: 'WAITING',
      customerId: new UniqueEntityID('f6c85da2-fb10-48e9-866d-742db03abe82'),
      createdAt: new Date(),
      ...override,
    },
    id,
  )

  return project
}

@Injectable()
export class ProjectFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaProject(data: Partial<ProjectProps> = {}): Promise<Project> {
    const project = makeProject(data)

    await this.prisma.project.create({
      data: PrismaProjectMapper.toPrisma(project),
    })

    return project
  }
}
