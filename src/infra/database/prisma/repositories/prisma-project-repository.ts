import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { ProjectRepository } from '@/domain/project/application/repositories/project-repository'
import { Project } from '@/domain/project/enterprise/entities/project'
import { PrismaProjectMapper } from '../mappers/prisma-project-mapper'
import { EditProjectProps } from '@/core/types/edit-project-props'
import { $Enums } from '@prisma/client'

@Injectable()
export class PrismaProjectRepository implements ProjectRepository {
  constructor(private prisma: PrismaService) {}

  async fetchCustomerProjects(customerId: string): Promise<Project[]> {
    const projects = await this.prisma.project.findMany({
      where: {
        customerId,
        statusProject: {
          not: 'CANCELED',
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        customer: true,
      },
    })

    return projects.map(PrismaProjectMapper.toDomainWithCustomer)
  }

  async fetchByStatus(
    status: $Enums.StatusProject,
    { page, size }: PaginationParams,
  ): Promise<Project[]> {
    const amount = size || 20
    const projects = await this.prisma.project.findMany({
      where: {
        statusProject: status,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: amount,
      skip: (page - 1) * amount,
    })

    return projects.map(PrismaProjectMapper.toDomain)
  }

  async remove(id: string): Promise<void> {
    await this.prisma.project.update({
      where: {
        id,
      },
      data: {
        statusProject: 'CANCELED',
        updatedAt: new Date(),
      },
    })
  }

  async update(id: string, project: EditProjectProps): Promise<Project> {
    const projectExists = await this.prisma.project.update({
      where: { id },
      data: {
        name: project.name,
        deadline: project.deadline,
        statusProject: project.statusProject,
        customerId: project.customerId,
        budget: project.budget,
        updatedAt: new Date(),
      },
    })

    return PrismaProjectMapper.toDomain(projectExists)
  }

  async findByName(name: string): Promise<Project | null> {
    const project = await this.prisma.project.findUnique({
      where: {
        name,
      },
    })

    if (!project) {
      return null
    }

    return PrismaProjectMapper.toDomain(project)
  }

  async findAll({ page, size }: PaginationParams): Promise<Project[]> {
    const amount = size || 20
    const project = await this.prisma.project.findMany({
      take: amount,
      skip: (page - 1) * amount,
      include: {
        customer: true,
      },
    })
    return project.map(PrismaProjectMapper.toDomainWithCustomer)
  }

  async findAllWithoutPagination(): Promise<{
    projects: Project[]
    total: number
  }> {
    const [projects, total] = await this.prisma.$transaction([
      this.prisma.project.findMany({
        include: {
          customer: true,
        },
        where: {
          statusProject: {
            not: 'CANCELED',
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.project.count(),
    ])

    return {
      projects: projects.map(PrismaProjectMapper.toDomainWithCustomer),
      total,
    }
  }

  async findById(id: string): Promise<Project | null> {
    const project = await this.prisma.project.findUnique({
      where: {
        id,
      },
    })

    if (!project) {
      return null
    }

    return PrismaProjectMapper.toDomain(project)
  }

  async create(project: Project): Promise<Project> {
    const data = PrismaProjectMapper.toPrisma(project)

    const newProject = await this.prisma.project.create({
      data,
    })
    return PrismaProjectMapper.toDomain(newProject)
  }
}
