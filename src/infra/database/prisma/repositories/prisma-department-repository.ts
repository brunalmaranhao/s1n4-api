import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { DepartmentRepository } from '@/domain/project/application/repositories/department'
import { PrismaDepartmentMapper } from '../mappers/prisma-department-mapper'
import { Department } from '@/domain/project/enterprise/entities/department'

@Injectable()
export class PrismaDepartmentRepository implements DepartmentRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<Department | null> {
    const department = await this.prisma.department.findUnique({
      where: {
        id,
      },
    })

    if (!department) {
      return null
    }

    return PrismaDepartmentMapper.toDomain(department)
  }

  async findAll(): Promise<Department[]> {
    const departments = await this.prisma.department.findMany()

    return departments.map(PrismaDepartmentMapper.toDomain)
  }

  async create(department: Department): Promise<Department> {
    const data = PrismaDepartmentMapper.toPrisma(department)

    const newDepartment = await this.prisma.department.create({
      data,
    })

    return PrismaDepartmentMapper.toDomain(newDepartment)
  }
}
