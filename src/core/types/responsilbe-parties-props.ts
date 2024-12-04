import { ResponsiblePartiesRole } from '@prisma/client'

export interface ResponsiblePartiesEditProps {
  firstName?: string
  lastName?: string
  phone?: string
  email?: string
  birthdate?: Date
  responsiblePartiesRole?: ResponsiblePartiesRole[]
}
