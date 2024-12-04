import { InMemoryUserRepository } from 'test/repositories/in-memory-users-repository'
import { RemoveUserUseCase } from './remove-user'
import { makeUser } from 'test/factories/make-user'

let inMemoryUserRepository: InMemoryUserRepository
let sut: RemoveUserUseCase

describe('Remove User', () => {
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRepository()

    sut = new RemoveUserUseCase(inMemoryUserRepository)
  })

  it('should change status to inactive when removing an active User', async () => {
    const activeUser = makeUser()

    const user = await inMemoryUserRepository.create(activeUser)

    const result = await sut.execute({
      id: user.id.toString(),
    })

    // console.log(inMemoryUserRepository.items[0])

    expect(result.isRight()).toBe(true)
    expect(result.value).toBeNull()
    expect(inMemoryUserRepository.items[0].status).toBe('INACTIVE')
  })
})
