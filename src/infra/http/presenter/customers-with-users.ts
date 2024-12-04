import { Customer } from '@/domain/project/enterprise/entities/customer'

export class CustomersWithUsersPresenter {
  static toHTTP(customer: Customer) {
    return {
      id: customer.id.toString(),
      name: customer.name,
      cnpj: customer.cnpj,
      corporateName: customer.corporateName,
      address: customer.address,
      accumulatedInvestment: customer.accumulatedInvestment,
      contractDuration: customer.contractDuration,
      contractObjective: customer.contractObjective,
      contractValue: customer.contractValue,
      contractedServices: customer.contractedServices,
      paymentMethods: customer.paymentMethods,
      expenditureProjection: customer.expenditureProjection,
      status: customer.status,
      createdAt: customer.createdAt,
      users: customer.users,
    }
  }
}
