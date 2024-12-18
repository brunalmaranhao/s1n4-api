import { Tag as PrismaTag, Prisma } from '@prisma/client'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Tag } from '@/domain/project/enterprise/entities/tags'

export class PrismaTagMapper {
  static toDomain(raw: PrismaTag): Tag {
    return Tag.create(
      {
        name: raw.name,
        color: raw.color,
        status: raw.status,
        customerId: new UniqueEntityID(raw.customerId),
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(tag: Tag): Prisma.TagUncheckedCreateInput {
    return {
      id: tag.id.toString(),
      name: tag.name,
      color: tag.color,
      status: tag.status,
      customerId: tag.customerId.toString(),
      createdAt: tag.createdAt,
      updatedAt: tag.updatedAt,
    }
  }
}
