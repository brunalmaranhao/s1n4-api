import { Status } from '@prisma/client'

export interface EditProjectProps {
  name?: string
  deadline?: Date | null
  status?: Status
  customerId?: string
  updatedAt?: Date
  budget?: number | null
  shouldShowInformationsToCustomerUser?: boolean
  finishedAt?: Date | null
}
