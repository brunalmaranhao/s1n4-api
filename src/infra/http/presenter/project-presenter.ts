import { Project } from '@/domain/project/enterprise/entities/project'

export class ProjectPresenter {
  static toHTTP(project: Project) {
    return {
      id: project.id.toString(),
      name: project.name,
      customerId: project.customerId.toString(),
      deadline: project.deadline,
      statusProject: project.statusProject,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
      customer: project.customer,
      budget: project.budget,
    }
  }
}
