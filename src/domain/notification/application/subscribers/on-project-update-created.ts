import { DomainEvents } from '@/core/events/domain-events'
import { EventHandler } from '@/core/events/event-handler'
import { SendNotificationUseCase } from '@/domain/notification/application/use-cases/send-notification'
import { ProjectUpdateRepository } from '@/domain/project/application/repositories/project-update-repository'
import { UserRepository } from '@/domain/project/application/repositories/user-repository'
import { ProjectUpdateCreatedEvent } from '@/domain/project/events/project-update-created-event'
import { Injectable } from '@nestjs/common'

@Injectable()
export class OnProjectUpdatedCreated implements EventHandler {
  constructor(
    private projectUpdateRepository: ProjectUpdateRepository,
    private sendNotification: SendNotificationUseCase,
    private userRepository: UserRepository,
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendNewProjectUpdateNotification.bind(this),
      ProjectUpdateCreatedEvent.name,
    )
  }

  private async sendNewProjectUpdateNotification({
    projectUpdate,
  }: ProjectUpdateCreatedEvent) {
    const projectUpdateObject = await this.projectUpdateRepository.findById(
      projectUpdate.id.toString(),
    )

    if (projectUpdateObject && projectUpdateObject.project?.customer?.users) {
      for (const user of projectUpdateObject.project?.customer?.users) {
        await this.sendNotification.execute({
          recipientId: user.id,
          title: `${projectUpdateObject.user?.firstName} adicionou uma nova atualização no projeto ${projectUpdateObject.project.name}`,
          content: projectUpdateObject.description,
        })
      }

      const usersAdmin = await this.userRepository.fetchUsersAdmin()
      if (usersAdmin.length > 0) {
        for (const user of usersAdmin) {
          await this.sendNotification.execute({
            recipientId: user.id.toString(),
            title: `${projectUpdateObject.user?.firstName} adicionou uma nova atualização no projeto ${projectUpdateObject.project.name}`,
            content: projectUpdate.description,
          })
        }
      }
    }
  }
}
