import { Tag } from '../../enterprise/entities/tags'

export type EditTagProps = {
  name?: string
  color?: string
}

export abstract class TagRepository {
  abstract create(Tag: Tag): Promise<Tag>
  abstract findById(TagId: string): Promise<Tag | null>
  abstract findByNameAndCustomer(
    name: string,
    customerId: string,
  ): Promise<Tag | null>

  abstract findByCustomer(customerId: string): Promise<Tag[]>

  abstract update(id: string, tag: EditTagProps): Promise<Tag>
  abstract remove(id: string): Promise<void>
  abstract searchByNameAndCustomer(
    name: string,
    customerId: string,
  ): Promise<Tag[]>
}
