import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { DomainEvent } from '@/core/events/domain-event'
import { ProjectUpdate } from '../enterprise/entities/projectUpdates'

export class ProjectUpdateCreatedEvent implements DomainEvent {
  public ocurredAt: Date
  public projectUpdate: ProjectUpdate

  constructor(projectUpdate: ProjectUpdate) {
    this.projectUpdate = projectUpdate
    this.ocurredAt = new Date()
  }

  getAggregateId(): UniqueEntityID {
    return this.projectUpdate.id
  }
}
