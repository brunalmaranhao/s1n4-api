import {
  Notification as PrismaNotification,
  Prisma,
  ProjectUpdates,
} from '@prisma/client'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Notification } from '@/domain/notification/enterprise/entities/notification'

type NotificationProps = PrismaNotification & {
  projectUpdates?: ProjectUpdates | null
}
export class PrismaNotificationMapper {
  static toDomain(raw: NotificationProps): Notification {
    return Notification.create(
      {
        title: raw.title,
        content: raw.content,
        recipientId: new UniqueEntityID(raw.recipientId),
        readAt: raw.readAt,
        createdAt: raw.createdAt,
        projectUpdates: raw.projectUpdates,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(
    notification: Notification,
  ): Prisma.NotificationUncheckedCreateInput {
    return {
      id: notification.id.toString(),
      recipientId: notification.recipientId.toString(),
      title: notification.title,
      content: notification.content,
      readAt: notification.readAt,
      createdAt: notification.createdAt,
      projectUpdatesId: notification.projectUpdateId?.toString(),
    }
  }
}
