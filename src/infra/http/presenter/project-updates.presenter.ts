import { ProjectUpdate } from '@/domain/project/enterprise/entities/projectUpdates'
import { Comments } from '@prisma/client'

type CommentProps = {
  id: string
  content: string
  createdAt: string
  updatedAt: string
  author: {
    id: string
    firstName: string
    lastName: string
    email: string
    role: string
  }
}

export class ProjectUpdatesPresenter {
  static toHTTP(project: ProjectUpdate) {
    return {
      id: project.id.toString(),
      userId: project.userId.toString(),
      project: project.project,
      description: project.description,
      date: project.createdAt,
      updateAt: project.updateAt,
      user: project.user,
      comments: project.comments?.map(ProjectUpdatesPresenter.toHttpComments),
    }
  }

  static toHttpComments(value: CommentProps | Comments) {
    const comment = value as CommentProps
    return {
      id: comment.id,
      content: comment.content,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
      author: {
        id: comment.author.id,
        name: comment.author.firstName + ' ' + comment.author.lastName,
        email: comment.author.email,
        role: comment.author.role,
      },
    }
  }
}
