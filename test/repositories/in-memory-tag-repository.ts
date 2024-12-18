import {
  EditTagProps,
  TagRepository,
} from '@/domain/project/application/repositories/tag-repository'
import { Tag } from '@/domain/project/enterprise/entities/tags'
import { BadRequestException } from '@nestjs/common'

export class InMemoryTagRepository implements TagRepository {
  public items: Tag[] = []

  async findByCustomer(customerId: string): Promise<Tag[]> {
    const tags = this.items.filter(
      (tag) => tag.customerId.toString() === customerId,
    )
    return tags
  }

  async findByNameAndCustomer(
    name: string,
    customerId: string,
  ): Promise<Tag | null> {
    const tag = this.items.find(
      (item) => item.customerId.toString() === customerId && item.name === name,
    )
    if (!tag) return null
    return tag
  }

  async create(tag: Tag): Promise<Tag> {
    this.items.push(tag)
    return tag
  }

  async findById(tagId: string): Promise<Tag | null> {
    const tag = this.items.find((item) => item.id.toString() === tagId)
    return tag ?? null
  }

  async update(id: string, tag: EditTagProps): Promise<Tag> {
    const tagIndex = this.items.findIndex((item) => item.id.toString() === id)
    if (tagIndex === -1) {
      throw new BadRequestException()
    }

    const existingTag = this.items[tagIndex]

    existingTag.name = tag.name ?? existingTag.name
    existingTag.color = tag.color ?? existingTag.color

    return existingTag
  }

  async remove(id: string): Promise<void> {
    const tagIndex = this.items.findIndex((item) => item.id.toString() === id)
    if (tagIndex === -1) {
      throw new BadRequestException()
    }
    this.items[tagIndex].status = 'INACTIVE'
  }

  async searchByNameAndCustomer(
    name: string,
    customerId: string,
  ): Promise<Tag[]> {
    const tags = this.items.filter(
      (tag) =>
        tag.customerId.toString() === customerId &&
        tag.name.toLowerCase().includes(name.toLowerCase()),
    )
    return tags
  }
}
