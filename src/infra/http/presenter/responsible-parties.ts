import { ResponsibleParties } from '@/domain/project/enterprise/entities/responsibleParties'

export class ResponsiblePartiesPresenter {
  static toHTTP(responsible: ResponsibleParties) {
    return {
      id: responsible.id.toString(),
      firstName: responsible.firstName,
      lastName: responsible.lastName,
      email: responsible.email,
      phone: responsible.phone,
      birthdate: responsible.birthdate,
      responsiblePartiesRole: responsible.responsiblePartiesRole,
      customerId: responsible.customerId.toString(),
    }
  }
}
