import { DomainEvents } from '@/core/events/domain-events'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { UserEditProps } from '@/core/types/user-props'
import { UserRepository } from '@/domain/project/application/repositories/user-repository'
import { User } from '@/domain/project/enterprise/entities/user'
import { Status } from '@prisma/client'

export class InMemoryUserRepository implements UserRepository {
  public items: User[] = []

  async fetchUsersAdmin(): Promise<User[]> {
    const users = this.items.filter(
      (user) =>
        user.role === 'INTERNAL_FINANCIAL_LEGAL' ||
        user.role === 'INTERNAL_MANAGEMENT' ||
        user.role === 'INTERNAL_PARTNERS',
    )

    return users
  }

  async fetchCostumerUsers(
    customerId: string,
    params: PaginationParams,
  ): Promise<User[]> {
    const users = this.items.filter(
      (user) => user.customerId?.toString() === customerId,
    )

    return users
  }

  async create(user: User): Promise<User> {
    this.items.push(user)

    DomainEvents.dispatchEventsForAggregate(user.id)
    return user
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = this.items.find((item) => item.email === email)

    if (!user) {
      return null
    }

    return user
  }

  async findById(userId: string): Promise<User | null> {
    const user = this.items.find((item) => item.id.toString() === userId)

    if (!user) {
      return null
    }

    return user
  }

  async update(userId: string, user: UserEditProps): Promise<User> {
    const userIndex = this.items.findIndex(
      (item) => item.id.toString() === userId,
    )

    return (this.items[userIndex] = user as User)
  }

  async updatePassword(userId: string, newPassword: string): Promise<User> {
    const itemIndex = this.items.findIndex(
      (item) => item.id.toString() === userId,
    )
    const user = this.items[itemIndex]
    user.password = newPassword

    return user
  }

  async findAll({ page }: PaginationParams): Promise<User[]> {
    const answers = this.items.slice((page - 1) * 20, page * 20)

    return answers
  }

  async fetchByStatus(
    status: Status,
    { page }: PaginationParams,
  ): Promise<User[]> {
    const user = this.items.slice((page - 1) * 20, page * 20)

    return user
  }

  async remove(id: string): Promise<void> {
    const user = this.items.find((item) => item.id.toString() === id)

    if (!user) {
      throw new Error('user not found')
    }

    user.status = 'INACTIVE'
  }
}
