import { faker } from '@faker-js/faker'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { Tag, TagProps } from '@/domain/project/enterprise/entities/tags'
import { PrismaTagMapper } from '@/infra/database/prisma/mappers/prisma-tag-mapper'

export function makeTag(override: Partial<TagProps> = {}, id?: UniqueEntityID) {
  const tag = Tag.create(
    {
      name: faker.company.name(),
      color: '#000',
      status: 'ACTIVE',
      customerId: new UniqueEntityID('f6c85da2-fb10-48e9-866d-742db03abe82'),
      createdAt: new Date(),
      ...override,
    },
    id,
  )

  return tag
}

@Injectable()
export class TagFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaTag(data: Partial<TagProps> = {}): Promise<Tag> {
    const tag = makeTag(data)

    await this.prisma.tag.create({
      data: PrismaTagMapper.toPrisma(tag),
    })

    return tag
  }
}
