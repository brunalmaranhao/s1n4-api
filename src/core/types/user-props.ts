import { UserRoles } from '@prisma/client'

export interface UserEditProps {
  firstName?: string
  lastName?: string
  role?: UserRoles
}
