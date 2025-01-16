import { faker } from '@faker-js/faker'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import {
  ListProjects,
  ListProjectsProps,
} from '@/domain/project/enterprise/entities/listProjects'
import { PrismaListProjectsMapper } from '@/infra/database/prisma/mappers/prisma-list-projects-mapper'

export function makeListProject(
  override: Partial<ListProjectsProps> = {},
  id?: UniqueEntityID,
) {
  const listProject = ListProjects.create(
    {
      name: faker.company.name(),
      status: 'ACTIVE',
      customerId: new UniqueEntityID('f6c85da2-fb10-48e9-866d-742db03abe82'),
      createdAt: new Date(),
      ...override,
      order: 0,
    },
    id,
  )

  return listProject
}

@Injectable()
export class ListProjectFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaListProject(
    data: Partial<ListProjectsProps> = {},
  ): Promise<ListProjects> {
    const ListProject = makeListProject(data)

    await this.prisma.listProjects.create({
      data: PrismaListProjectsMapper.toPrisma(ListProject),
    })

    return ListProject
  }
}
