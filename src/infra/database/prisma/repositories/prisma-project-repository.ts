import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { ProjectRepository } from '@/domain/project/application/repositories/project-repository'
import { Project } from '@/domain/project/enterprise/entities/project'
import { PrismaProjectMapper } from '../mappers/prisma-project-mapper'
import { EditProjectProps } from '@/core/types/edit-project-props'
import { Prisma, Status, StatusProject } from '@prisma/client'
import { Tag } from '@/domain/project/enterprise/entities/tags'

@Injectable()
export class PrismaProjectRepository implements ProjectRepository {
  constructor(private prisma: PrismaService) {}
  async updateName(id: string, name: string): Promise<Project> {
    const project = await this.prisma.project.update({
      where: {
        id,
      },
      data: {
        name,
      },
    })

    return PrismaProjectMapper.toDomain(project)
  }

  async fetchCustomerProjects(customerId: string): Promise<Project[]> {
    const projects = await this.prisma.project.findMany({
      where: {
        customerId,
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
    status: Status,
    { page, size }: PaginationParams,
  ): Promise<Project[]> {
    const amount = size || 20
    const projects = await this.prisma.project.findMany({
      where: {
        status,
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
        status: 'INACTIVE',
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
        status: project.status,
        customerId: project.customerId,
        budget: project.budget,
        updatedAt: new Date(),
        shouldShowInformationsToCustomerUser:
          project.shouldShowInformationsToCustomerUser,
      },
    })

    return PrismaProjectMapper.toDomain(projectExists)
  }

  async findByName(name: string): Promise<Project | null> {
    const project = await this.prisma.project.findFirst({
      where: {
        name,
      },
    })

    if (!project) {
      return null
    }

    return PrismaProjectMapper.toDomain(project)
  }

  async findByNameAndCustomer(
    name: string,
    customerId: string,
  ): Promise<Project | null> {
    const project = await this.prisma.project.findFirst({
      where: {
        name,
        customerId,
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
        tags: true,
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
          tags: true,
        },
        where: {
          status: {
            not: 'INACTIVE',
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

  async findByStatus(status: StatusProject): Promise<{
    projects: Project[]
    total: number
  }> {
    const [projects, total] = await this.prisma.$transaction([
      this.prisma.project.findMany({
        include: {
          customer: true,
          tags: true,
        },
        where: {
          status,
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.project.count(),
    ])
    // console.log(projects)
    return {
      projects: projects.map(PrismaProjectMapper.toDomainWithCustomer),
      total,
    }
  }

  async findByStatusAndCustomer(
    status: StatusProject,
    customer: string,
  ): Promise<{
    projects: Project[]
    total: number
  }> {
    const [projects, total] = await this.prisma.$transaction([
      this.prisma.project.findMany({
        include: {
          customer: true,
          tags: true,
        },
        where: {
          status,
          customerId: customer,
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.project.count({
        where: {
          customerId: customer,
        },
      }),
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
      include: {
        customer: true,
        tags: true,
      },
    })

    if (!project) {
      return null
    }

    return PrismaProjectMapper.toDomainWithCustomer(project)
  }

  async create(project: Project): Promise<Project> {
    const data = PrismaProjectMapper.toPrisma(project)

    const newProject = await this.prisma.project.create({
      data,
    })
    return PrismaProjectMapper.toDomain(newProject)
  }

  async findOverdueProjects(
    date: Date,
    customerId?: string,
  ): Promise<{ overdueProjects: Project[]; totalActiveProjects: number }> {
    const whereCondition: Prisma.ProjectWhereInput = {
      AND: [
        { deadline: { lt: date } },
        { status: 'ACTIVE' },
        ...(customerId ? [{ customerId }] : []),
      ],
    }

    const overdueProjects = await this.prisma.project.findMany({
      where: whereCondition,
      include: {
        customer: true,
        tags: true,
      },
      orderBy: {
        deadline: 'asc',
      },
    })

    const totalActiveProjects = await this.prisma.project.count({
      where: {
        status: {
          not: 'INACTIVE',
        },
        ...(customerId && { customerId }),
      },
    })

    return {
      overdueProjects: overdueProjects.map(
        PrismaProjectMapper.toDomainWithCustomer,
      ),
      totalActiveProjects,
    }
  }

  async getProjectsByDateRange(
    startDate: Date,
    endDate: Date,
    customerId: string,
  ): Promise<Project[]> {
    const projects = await this.prisma.project.findMany({
      where: {
        customerId,
        AND: [
          {
            start: { lte: endDate },
          },
          {
            deadline: { gte: startDate },
          },
        ],
      },
      include: {
        customer: true,
        tags: true,
      },
    })

    return projects.map(PrismaProjectMapper.toDomainWithCustomer)
  }

  async addProjectList(
    projectId: string,
    listProjectId: string,
    shouldSaveUpdateDate: boolean,
  ): Promise<void> {
    // console.log(shouldSaveUpdateDate)
    const updateData: Record<string, any> = {
      listProjectsId: listProjectId,
    }

    if (shouldSaveUpdateDate) {
      updateData.updatedListProjectAt = new Date()
    }

    await this.prisma.project.update({
      where: {
        id: projectId,
      },
      data: updateData,
    })
  }

  async updateShouldShowInformationsToCustomerUser(
    id: string,
    value: boolean,
  ): Promise<void> {
    await this.prisma.project.update({
      where: {
        id,
      },
      data: {
        shouldShowInformationsToCustomerUser: value,
      },
    })
  }

  async finishOrActive(id: string, isFinish: boolean): Promise<void> {
    await this.prisma.project.update({
      where: {
        id,
      },
      data: {
        status: isFinish ? 'DONE' : 'ACTIVE',
        finishedAt: isFinish ? new Date() : null,
      },
    })
  }

  async addTagToProject(projectId: string, tag: Tag): Promise<void> {
    await this.prisma.project.update({
      where: { id: projectId },
      data: {
        tags: {
          connect: { id: tag.id.toString() },
        },
      },
    })
  }

  async removeTagFromProject(projectId: string, tagId: string): Promise<void> {
    await this.prisma.project.update({
      where: { id: projectId },
      data: {
        tags: {
          disconnect: { id: tagId },
        },
      },
    })
  }
}
