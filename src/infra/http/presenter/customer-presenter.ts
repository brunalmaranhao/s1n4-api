import { Customer } from '@/domain/project/enterprise/entities/customer'

export class CustomerPresenter {
  static toHTTP(customer: Customer) {
    // console.log(customer)
    return {
      id: customer.id.toString(),
      name: customer.name,
      cnpj: customer.cnpj,
      corporateName: customer.corporateName,
      zipCode:
        customer.address &&
        customer.address?.length >= 1 &&
        customer.address[0].zipCode,
      accumulatedInvestment: customer.accumulatedInvestment,
      contractDuration: customer.contractDuration,
      contractObjective: customer.contractObjective,
      contractValue: customer.contractValue,
      contractedServices: customer.contractedServices,
      status: customer.status,
    }
  }

  static toHTTPWithAllFields(customer: Customer) {
    return {
      id: customer.id.toString(),
      name: customer.name,
      cnpj: customer.cnpj,
      corporateName: customer.corporateName,
      zipCode:
        customer.address &&
        customer.address?.length >= 1 &&
        customer.address[0].zipCode,
      accumulatedInvestment: customer.accumulatedInvestment,
      contractDuration: customer.contractDuration,
      contractObjective: customer.contractObjective,
      contractValue: customer.contractValue,
      contractedServices: customer.contractedServices,
      status: customer.status,
      address: customer.address,
      users: customer.users,
      projects: customer.projects,
    }
  }

  static toHTTPWithAdressAndUsers(customer: Customer) {
    return {
      id: customer.id.toString(),
      name: customer.name,
      cnpj: customer.cnpj,
      corporateName: customer.corporateName,
      zipCode:
        customer.address &&
        customer.address?.length >= 1 &&
        customer.address[0].zipCode,
      accumulatedInvestment: customer.accumulatedInvestment,
      contractDuration: customer.contractDuration,
      contractObjective: customer.contractObjective,
      contractValue: customer.contractValue,
      contractedServices: customer.contractedServices,
      status: customer.status,
      address: customer.address,
      users: customer.users,
    }
  }

  static toHTTPWithProjects(customer: Customer) {
    return {
      id: customer.id.toString(),
      name: customer.name,
      cnpj: customer.cnpj,
      corporateName: customer.corporateName,
      zipCode:
        customer.address &&
        customer.address?.length >= 1 &&
        customer.address[0].zipCode,
      accumulatedInvestment: customer.accumulatedInvestment,
      contractDuration: customer.contractDuration,
      contractObjective: customer.contractObjective,
      contractValue: customer.contractValue,
      contractedServices: customer.contractedServices,
      status: customer.status,
      projects: customer.projects,
      users: customer.users,
    }
  }
}
