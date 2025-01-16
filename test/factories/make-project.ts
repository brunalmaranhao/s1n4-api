import { faker } from '@faker-js/faker'
import { randomUUID } from 'node:crypto'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import {
  Project,
  ProjectProps,
} from '@/domain/project/enterprise/entities/project'
import { PrismaProjectMapper } from '@/infra/database/prisma/mappers/prisma-project-mapper'
import { makeListProject } from './make-list-project-repository'
import { makeCustomer } from './make-customer'
import { PrismaCustomerMapper } from '@/infra/database/prisma/mappers/prisma-customer-mapper'
import { PrismaListProjectsMapper } from '@/infra/database/prisma/mappers/prisma-list-projects-mapper'

export function makeProject(
  override: Partial<ProjectProps> = {},
  id?: UniqueEntityID,
) {
  const project = Project.create(
    {
      name: faker.company.name(),
      deadline: faker.date.future(),
      status: 'ACTIVE',
      customerId: new UniqueEntityID('f6c85da2-fb10-48e9-866d-742db03abe82'),
      listProjectsId: new UniqueEntityID(
        'f6c85da1-fb10-48e9-866d-742db03abe82',
      ),
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
    const customer = makeCustomer({
      cnpj: randomUUID(),
      name: randomUUID(),
      corporateName: randomUUID(),
    })

    await this.prisma.customer.create({
      data: PrismaCustomerMapper.toPrisma(customer),
    })

    const listProject = makeListProject({
      customerId: customer.id,
    })

    await this.prisma.listProjects.create({
      data: PrismaListProjectsMapper.toPrisma(listProject),
    })

    const project = makeProject({
      ...data,
      listProjectsId: data.listProjectsId
        ? data.listProjectsId
        : listProject.id,
    })

    await this.prisma.project.create({
      data: PrismaProjectMapper.toPrisma(project),
    })

    return project
  }
}
