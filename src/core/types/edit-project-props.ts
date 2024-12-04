import { StatusProject } from '@prisma/client'

export interface EditProjectProps {
  name?: string
  deadline?: Date | null
  statusProject?: StatusProject
  customerId?: string
  updatedAt?: Date
  budget?: number | null
}
