import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { ListProjectRepository } from '@/domain/project/application/repositories/list-projects-repository'
import { ListProjects } from '@/domain/project/enterprise/entities/listProjects'
import { PrismaListProjectsMapper } from '../mappers/prisma-list-projects-mapper'

@Injectable()
export class PrismaListProjectRepository implements ListProjectRepository {
  constructor(private prisma: PrismaService) {}

  async findByNameAndCustomerId(
    customerId: string,
    name: string,
  ): Promise<ListProjects | null> {
    const listProject = await this.prisma.listProjects.findFirst({
      where: {
        customerId,
        name,
      },
    })

    if (!listProject) return null

    return PrismaListProjectsMapper.toDomain(listProject)
  }

  async remove(id: string): Promise<void> {
    await this.prisma.listProjects.update({
      where: {
        id,
      },
      data: {
        status: 'INACTIVE',
        updatedAt: new Date(),
      },
    })
  }

  async update(id: string, name: string): Promise<ListProjects> {
    const listProject = await this.prisma.listProjects.update({
      where: { id },
      data: {
        name,
      },
    })

    return PrismaListProjectsMapper.toDomain(listProject)
  }

  async findById(id: string): Promise<ListProjects | null> {
    const list = await this.prisma.listProjects.findUnique({
      where: {
        id,
      },
      include: {
        projects: true,
      },
    })

    if (!list) {
      return null
    }

    return PrismaListProjectsMapper.toDomainWithProjects(list)
  }

  async findByCustomerIdAndDate(
    customerId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<ListProjects[]> {
    const listProjects = await this.prisma.listProjects.findMany({
      where: {
        customerId,
        status: 'ACTIVE',
      },
      orderBy: {
        order: 'asc',
      },
      include: {
        projects: {
          where: {
            status: {
              not: 'INACTIVE',
            },
            start: {
              gte: startDate, // Filtro para garantir que a data de início seja após a data de startDate
              lte: endDate, // Filtro para garantir que a data de início seja antes da data de endDate
            },
          },
          include: {
            customer: true,
            tags: {
              where: {
                status: 'ACTIVE',
              },
              orderBy: {
                createdAt: 'asc',
              },
            },
            listProjects: true,
          },
        },
      },
    })

    return listProjects.map(PrismaListProjectsMapper.toDomainWithProjects)
  }

  async findByCustomerId(customerId: string): Promise<ListProjects[]> {
    const listProjects = await this.prisma.listProjects.findMany({
      where: {
        customerId,
        status: 'ACTIVE',
      },
      orderBy: {
        order: 'asc',
      },
      include: {
        projects: {
          where: {
            status: {
              not: 'INACTIVE',
            },
          },
          include: {
            customer: {
              include: {
                responsibleParties: true,
              },
            },
            tags: {
              where: {
                status: 'ACTIVE',
              },
              orderBy: {
                createdAt: 'asc',
              },
            },
            listProjects: true,
          },
        },
      },
    })
    return listProjects.map(PrismaListProjectsMapper.toDomainWithProjects)
  }

  async create(listProject: ListProjects): Promise<ListProjects> {
    const data = PrismaListProjectsMapper.toPrisma(listProject)

    const newListProject = await this.prisma.listProjects.create({
      data,
    })
    return PrismaListProjectsMapper.toDomain(newListProject)
  }

  async updateOrder(orderData: { id: string; order: number }[]): Promise<void> {
    const updatePromises = orderData.map(({ id, order }) =>
      this.prisma.listProjects.update({
        where: { id },
        data: { order },
      }),
    )

    await Promise.all(updatePromises)
  }
}
