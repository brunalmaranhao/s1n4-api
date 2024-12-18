import { ListProjects } from '@/domain/project/enterprise/entities/listProjects'

export class ListProjectPresenter {
  static toHTTP(listProject: ListProjects) {
    return {
      id: listProject.id.toString(),
      name: listProject.name,
      customerId: listProject.customerId.toString(),
      status: listProject.status,
      createdAt: listProject.createdAt,
      updatedAt: listProject.updatedAt,
      projects: listProject.projects,
      isDone: listProject.isDone,
    }
  }
}
