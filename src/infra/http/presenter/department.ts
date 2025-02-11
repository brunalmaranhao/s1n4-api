import { Department } from '@/domain/project/enterprise/entities/department'

export class DepartmentPresenter {
  static toHTTP(department: Department) {
    return {
      id: department.id.toString(),
      name: department.name,
      description: department.description,
      createdAt: department.createdAt,
      updatedAt: department.updatedAt,
    }
  }
}
