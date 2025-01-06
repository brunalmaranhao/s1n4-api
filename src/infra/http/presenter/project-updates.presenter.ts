import { ProjectUpdate } from '@/domain/project/enterprise/entities/projectUpdates'
import { Comments, Reaction } from '@prisma/client'

type CommentProps = {
  id: string
  content: string
  createdAt: string
  updatedAt: string
  reactions: Reaction[]
  author: {
    id: string
    firstName: string
    lastName: string
    email: string
    role: string
  }
}

type ReactionProps = {
  id: string
  emoji: {
    unified: string
    char: string
  }
  commentId?: string
  projectUpdateId?: string
  user: {
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
      reactions: ProjectUpdatesPresenter.groupReactionsByUnified(
        project.reactions?.map(ProjectUpdatesPresenter.toHttpReactions) || [],
      ),
    }
  }

  static toHttpComments(value: CommentProps | Comments) {
    const comment = value as CommentProps
    console.log(comment)
    return {
      id: comment.id,
      content: comment.content,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
      reactions: ProjectUpdatesPresenter.groupReactionsByUnified(
        comment.reactions?.map(ProjectUpdatesPresenter.toHttpReactions) || [],
      ),
      author: {
        id: comment.author.id,
        name: comment.author.firstName + ' ' + comment.author.lastName,
        email: comment.author.email,
        role: comment.author.role,
      },
    }
  }

  static toHttpReactions(value: ReactionProps | Reaction) {
    const reaction = value as ReactionProps
    return {
      id: reaction.id,
      unified: reaction.emoji.unified,
      char: reaction.emoji.char,
      commentId: reaction.commentId,
      projectUpdateId: reaction.projectUpdateId,
      author: {
        id: reaction.user.id,
        name: reaction.user.firstName + ' ' + reaction.user.lastName,
        email: reaction.user.email,
        role: reaction.user.role,
      },
    }
  }

  static groupReactionsByUnified(
    reactions: { id: string; unified: string; author: any }[],
  ) {
    return reactions.reduce(
      (grouped, reaction) => {
        if (!grouped[reaction.unified]) {
          grouped[reaction.unified] = []
        }
        grouped[reaction.unified].push(reaction)
        return grouped
      },
      {} as Record<string, { id: string; unified: string; author: any }[]>,
    )
  }
}
