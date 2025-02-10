import { Project as PrismaProject, Prisma, Customer, Tag } from '@prisma/client'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Project } from '@/domain/project/enterprise/entities/project'

type PrismaProjectProps = PrismaProject & {
  customer?: Customer
  tags?: Tag[]
}
export class PrismaProjectMapper {
  static toDomainWithCustomer(raw: PrismaProjectProps): Project {
    return Project.create(
      {
        name: raw.name,
        deadline: raw.deadline,
        start: raw.start,
        status: raw.status,
        customerId: new UniqueEntityID(raw.customerId),
        createdAt: raw.createdAt,
        description: raw.description,
        updatedAt: raw.updatedAt,
        customer: raw.customer,
        budget: raw.budget,
        finishedAt: raw.finishedAt,
        listProjectsId: new UniqueEntityID(raw.listProjectsId),
        updatedListProjectAt: raw.updatedListProjectAt,
        shouldShowInformationsToCustomerUser:
          raw.shouldShowInformationsToCustomerUser,
        tags: raw.tags,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toDomain(raw: PrismaProject): Project {
    return Project.create(
      {
        name: raw.name,
        start: raw.start,
        deadline: raw.deadline,
        description: raw.description,
        status: raw.status,
        customerId: new UniqueEntityID(raw.customerId),
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
        finishedAt: raw.finishedAt,
        budget: raw.budget,
        listProjectsId: new UniqueEntityID(raw.listProjectsId),
        updatedListProjectAt: raw.updatedListProjectAt,
        shouldShowInformationsToCustomerUser:
          raw.shouldShowInformationsToCustomerUser,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(project: Project): Prisma.ProjectUncheckedCreateInput {
    return {
      id: project.id.toString(),
      name: project.name,
      deadline: project.deadline,
      description: project.description,
      status: project.status,
      customerId: project.customerId.toString(),
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
      finishedAt: project.finishedAt,
      start: project.start,
      budget: project.budget,
      listProjectsId: project.listProjectsId.toString(),
      updatedListProjectAt: project.updatedListProjectAt,
      shouldShowInformationsToCustomerUser:
        project.shouldShowInformationsToCustomerUser,
    }
  }
}
