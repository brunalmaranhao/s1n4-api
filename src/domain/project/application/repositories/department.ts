import { Department } from '../../enterprise/entities/department'

export abstract class DepartmentRepository {
  abstract findById(id: string): Promise<Department | null>

  abstract create(department: Department): Promise<Department>

  abstract findAll(): Promise<Department[]>
}
