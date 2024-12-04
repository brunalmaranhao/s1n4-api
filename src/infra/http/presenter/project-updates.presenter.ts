import { ProjectUpdate } from '@/domain/project/enterprise/entities/projectUpdates'

export class ProjectUpdatesPresenter {
  static toHTTP(project: ProjectUpdate) {
    // console.log(project)
    return {
      id: project.id.toString(),
      userId: project.userId.toString(),
      project: project.project,
      description: project.description,
      date: project.createdAt,
      updateAt: project.updateAt,
      user: project.user,
    }
  }
}
