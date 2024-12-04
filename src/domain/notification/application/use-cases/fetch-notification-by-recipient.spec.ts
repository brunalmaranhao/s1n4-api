import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { makeNotification } from 'test/factories/make-notification'
import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications-repository'
import { FetchNotificationsUseCase } from './fetch-notification-by-recipient'
import { InMemoryUserRepository } from 'test/repositories/in-memory-users-repository'
import { makeUser } from 'test/factories/make-user'

let inMemoryUserRepository: InMemoryUserRepository
let inMemoryNotificationsRepository: InMemoryNotificationsRepository
let sut: FetchNotificationsUseCase

describe('Fetch Notifications', () => {
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRepository()
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository()
    sut = new FetchNotificationsUseCase(inMemoryNotificationsRepository)
  })

  it('should be able to fetch a notifications', async () => {
    const user = makeUser()
    inMemoryUserRepository.create(user)

    const notification = makeNotification({
      recipientId: user.id,
    })

    inMemoryNotificationsRepository.create(notification)

    const result = await sut.execute({
      recipientId: notification.recipientId.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryNotificationsRepository.items[0].recipientId).toEqual(
      user.id,
    )
  })
})
