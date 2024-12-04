import { PaginationParams } from '@/core/repositories/pagination-params'
import { User } from './../../enterprise/entities/user'
import { Status } from '@prisma/client'
import { UserEditProps } from '@/core/types/user-props'

export abstract class UserRepository {
  abstract create(user: User): Promise<User>
  abstract findByEmail(email: string): Promise<User | null>
  abstract findById(userId: string): Promise<User | null>
  abstract updatePassword(userId: string, newPassword: string): Promise<User>
  abstract findAll({ page, size }: PaginationParams): Promise<User[]>
  abstract fetchByStatus(
    status: Status,
    { page, size }: PaginationParams,
  ): Promise<User[]>

  abstract update(userId: string, user: UserEditProps): Promise<User>

  abstract remove(id: string): Promise<void>
  abstract fetchCostumerUsers(
    customerId: string,
    params: PaginationParams,
  ): Promise<User[]>

  abstract fetchUsersAdmin(): Promise<User[]>
}
