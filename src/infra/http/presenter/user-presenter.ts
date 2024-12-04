import { User } from '@/domain/project/enterprise/entities/user'

export class UserPresenter {
  static toHTTP(user: User) {
    return {
      id: user.id.toString(),
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      status: user.status,
      customerId: user.customerId?.toString(),
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      customer: user.customer,
    }
  }
}
