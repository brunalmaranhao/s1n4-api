import { Tag } from '@/domain/project/enterprise/entities/tags'

export class TagPresenter {
  static toHTTP(tag: Tag) {
    return {
      id: tag.id.toString(),
      name: tag.name,
      color: tag.color,
      customerId: tag.customerId.toString(),
      createdAt: tag.createdAt,
      updatedAt: tag.updatedAt,
    }
  }
}
