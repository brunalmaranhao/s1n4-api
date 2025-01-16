import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Either, right } from '@/core/either'
import { Notification } from '../../enterprise/entities/notification'
import { NotificationsRepository } from '../repositories/notifications-repository'
import { Injectable } from '@nestjs/common'

export interface SendNotificationUseCaseRequest {
  recipientId: string
  title: string
  content: string
  projectUpdateId?: string
}

export type SendNotificationUseCaseResponse = Either<
  null,
  {
    notification: Notification
  }
>

@Injectable()
export class SendNotificationUseCase {
  constructor(private notificationsRepository: NotificationsRepository) {}

  async execute({
    recipientId,
    title,
    content,
    projectUpdateId,
  }: SendNotificationUseCaseRequest): Promise<SendNotificationUseCaseResponse> {
    // console.log(projectUpdateId)
    const notification = Notification.create({
      recipientId: new UniqueEntityID(recipientId),
      title,
      content,
      projectUpdateId: new UniqueEntityID(projectUpdateId),
    })

    await this.notificationsRepository.create(notification)

    return right({
      notification,
    })
  }
}
