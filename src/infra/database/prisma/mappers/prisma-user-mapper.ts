import {
  User as PrismaUser,
  Prisma,
  Customer,
  Department,
} from '@prisma/client'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { User } from '@/domain/project/enterprise/entities/user'

type UserProps = PrismaUser & {
  customer?: Customer | null
  department?: Department | null
}
export class PrismaUserMapper {
  static toDomainWithCustomer(raw: UserProps): User {
    return User.create(
      {
        firstName: raw.firstName,
        lastName: raw.lastName,
        email: raw.email,
        password: raw.password,
        status: raw.status,
        createdAt: raw.createdAt,
        role: raw.role,
        customerId: new UniqueEntityID(raw.customerId),
        customer: raw.customer,
        department: raw.department,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toDomain(raw: PrismaUser): User {
    return User.create(
      {
        firstName: raw.firstName,
        lastName: raw.lastName,
        email: raw.email,
        password: raw.password,
        status: raw.status,
        createdAt: raw.createdAt,
        role: raw.role,
        customerId: new UniqueEntityID(raw.customerId),
        departmentId: new UniqueEntityID(raw.departmentId),
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(user: User): Prisma.UserUncheckedCreateInput {
    return {
      id: user.id.toString(),
      firstName: user.firstName,
      lastName: user.lastName,
      password: user.password,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      email: user.email,
      role: user.role ?? 'INTERNAL_MANAGEMENT',
      status: user.status,
      customerId: user.customerId?.toString(),
      departmentId: user.departmentId?.toString(),
    }
  }
}
