import { Department as PrismaDepartment, Prisma } from '@prisma/client'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Department } from '@/domain/project/enterprise/entities/Department'

export class PrismaDepartmentMapper {
  static toDomain(raw: PrismaDepartment): Department {
    return Department.create(
      {
        name: raw.name,
        createdAt: raw.createdAt,
        description: raw.description,
        status: raw.status,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(
    department: Department,
  ): Prisma.DepartmentUncheckedCreateInput {
    return {
      id: department.id.toString(),
      name: department.name,
      description: department.description,
      createdAt: department.createdAt,
      status: department.status,
      updatedAt: department.updatedAt,
    }
  }
}
