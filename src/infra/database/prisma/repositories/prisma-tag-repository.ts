import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import {
  EditTagProps,
  TagRepository,
} from '@/domain/project/application/repositories/tag-repository'
import { Tag } from '@/domain/project/enterprise/entities/tags'
import { PrismaTagMapper } from '../mappers/prisma-tag-mapper'

@Injectable()
export class PrismaTagRepository implements TagRepository {
  constructor(private prisma: PrismaService) {}

  async remove(id: string): Promise<void> {
    await this.prisma.tag.update({
      where: {
        id,
      },
      data: {
        status: 'INACTIVE',
        updatedAt: new Date(),
      },
    })
  }

  async update(id: string, tag: EditTagProps): Promise<Tag> {
    const tagExist = await this.prisma.tag.update({
      where: { id },
      data: {
        name: tag.name,
        color: tag.color,
      },
    })

    return PrismaTagMapper.toDomain(tagExist)
  }

  async findByNameAndCustomer(
    name: string,
    customerId: string,
  ): Promise<Tag | null> {
    const tag = await this.prisma.tag.findFirst({
      where: {
        name,
        customerId,
      },
    })

    if (!tag) {
      return null
    }

    return PrismaTagMapper.toDomain(tag)
  }

  async searchByNameAndCustomer(
    name: string,
    customerId: string,
  ): Promise<Tag[]> {
    const tags = await this.prisma.tag.findMany({
      where: {
        name: {
          contains: name,
          mode: 'insensitive',
        },
        customerId,
      },
    })

    return tags.map(PrismaTagMapper.toDomain)
  }

  async findByCustomer(customerId: string): Promise<Tag[]> {
    const tags = await this.prisma.tag.findMany({
      where: {
        customerId,
        status: 'ACTIVE',
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return tags.map(PrismaTagMapper.toDomain)
  }

  async findById(id: string): Promise<Tag | null> {
    const tag = await this.prisma.tag.findUnique({
      where: {
        id,
      },
    })

    if (!tag) {
      return null
    }

    return PrismaTagMapper.toDomain(tag)
  }

  async create(tag: Tag): Promise<Tag> {
    const data = PrismaTagMapper.toPrisma(tag)

    const newTag = await this.prisma.tag.create({
      data,
    })
    return PrismaTagMapper.toDomain(newTag)
  }
}
