import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { $Enums, Status } from '@prisma/client'
import { ProjectUpdateRepository } from '@/domain/project/application/repositories/project-update-repository'
import { ProjectUpdate } from '@/domain/project/enterprise/entities/projectUpdates'
import { PrismaProjectUpdateMapper } from '../mappers/prisma-project-update-mapper'
import { DomainEvents } from '@/core/events/domain-events'

@Injectable()
export class PrismaProjectUpdateRepository implements ProjectUpdateRepository {
  constructor(private prisma: PrismaService) {}

  async fetchAllProjectUpdates(
    { page, size }: PaginationParams,
    status: Status,
  ): Promise<ProjectUpdate[]> {
    const amount = size || 20
    const projects = await this.prisma.projectUpdates.findMany({
      where: {
        status,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: amount,
      skip: (page - 1) * amount,
      include: {
        project: {
          include: {
            customer: {
              include: {
                users: true,
              },
            },
          },
        },
        comments: {
          include: {
            author: true,
          },
          where: {
            status: 'ACTIVE',
          },
        },
        user: true,
      },
    })

    return projects.map(PrismaProjectUpdateMapper.toDomainWithProject)
  }

  async fetchByStatusAndCustomerId(
    status: $Enums.Status,
    customerId: string,
    { page, size }: PaginationParams,
  ): Promise<ProjectUpdate[]> {
    const amount = size || 20
    const projects = await this.prisma.projectUpdates.findMany({
      where: {
        status,
        project: {
          customerId,
        },
      },
      include: {
        project: {
          include: {
            customer: {
              include: {
                address: true,
              },
            },
          },
        },
        comments: {
          include: {
            author: true,
          },
          where: {
            status: 'ACTIVE',
          },
          orderBy: {
            createdAt: 'asc',
          },
        },
        user: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: amount,
      skip: (page - 1) * amount,
    })

    return projects.map(PrismaProjectUpdateMapper.toDomainWithProject)
  }

  async remove(id: string): Promise<void> {
    await this.prisma.projectUpdates.update({
      where: {
        id,
      },
      data: {
        status: 'INACTIVE',
        updatedAt: new Date(),
      },
    })
  }

  async update(id: string, description: string): Promise<ProjectUpdate> {
    const projectExists = await this.prisma.projectUpdates.update({
      where: { id },
      data: {
        description,
        updatedAt: new Date(),
      },
    })

    return PrismaProjectUpdateMapper.toDomain(projectExists)
  }

  async findAll({ page, size }: PaginationParams): Promise<ProjectUpdate[]> {
    const amount = size || 20
    const project = await this.prisma.projectUpdates.findMany({
      take: amount,
      skip: (page - 1) * amount,
      include: {
        project: {
          include: {
            customer: {
              include: {
                users: true,
              },
            },
          },
        },
        comments: {
          include: {
            author: true,
          },
        },
        user: true,
      },
    })
    return project.map(PrismaProjectUpdateMapper.toDomainWithProject)
  }

  async findById(id: string): Promise<ProjectUpdate | null> {
    const project = await this.prisma.projectUpdates.findUnique({
      where: {
        id,
      },
      include: {
        project: {
          include: {
            customer: {
              include: {
                users: true,
              },
            },
          },
        },
        comments: {
          include: {
            author: true,
          },
        },
        user: true,
      },
    })

    if (!project) {
      return null
    }

    return PrismaProjectUpdateMapper.toDomainWithProject(project)
  }

  async create(project: ProjectUpdate): Promise<ProjectUpdate> {
    const data = PrismaProjectUpdateMapper.toPrisma(project)

    const newProject = await this.prisma.projectUpdates.create({
      data,
    })
    DomainEvents.dispatchEventsForAggregate(project.id)
    return PrismaProjectUpdateMapper.toDomain(newProject)
  }

  async fetchByProjectId(projectId: string): Promise<ProjectUpdate[]> {
    const projects = await this.prisma.projectUpdates.findMany({
      where: {
        status: 'ACTIVE',
        projectId,
      },
      include: {
        project: {
          include: {
            customer: {
              include: {
                address: true,
              },
            },
          },
        },
        comments: {
          include: {
            author: true,
          },
          where: {
            status: 'ACTIVE',
          },
          orderBy: {
            createdAt: 'asc',
          },
        },
        user: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return projects.map(PrismaProjectUpdateMapper.toDomainWithProject)
  }
}
