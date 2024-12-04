import { CustomerAddress } from '@/domain/project/enterprise/entities/customerAddress'
import { User } from '@/domain/project/enterprise/entities/user'
import {
  Status,
  CustomerAddress as PrismaCustomerAddress,
  PaymentMethod,
} from '@prisma/client'

export interface CustomerEditProps {
  contractDuration?: string | null
  contractValue?: number | null
  paymentMethods?: PaymentMethod | null
  accumulatedInvestment?: number | null
  expenditureProjection?: number | null
  contractObjective?: string | null
  contractedServices?: string | null
  status?: Status
}

export interface CustomerWithUsersKeyProps {
  name: string
  corporateName: string
  cnpj: string
  contractDuration?: string | null
  contractValue?: number | null
  paymentMethods?: PaymentMethod | null
  accumulatedInvestment?: number | null
  expenditureProjection?: number | null
  contractObjective?: string | null
  contractedServices?: string | null
  status?: Status
  createdAt?: Date
  updatedAt?: Date | null
  address?: CustomerAddress[] | PrismaCustomerAddress[] | null
  users?: User[]
}

export interface CustomerWithUsersProps {
  customersWithUsers: CustomerWithUsersKeyProps[]
}
