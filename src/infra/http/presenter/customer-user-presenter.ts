import { User } from '@/domain/project/enterprise/entities/user'

export class CustomerUsersPresenter {
  static toHTTP(user: User) {
    return {
      id: user.id.toString(),
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      status: user.status,
      customerId: user.customerId?.toValue(),
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }
  }
}
