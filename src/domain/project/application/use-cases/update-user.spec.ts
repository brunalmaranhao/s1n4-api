import { InMemoryUserRepository } from 'test/repositories/in-memory-users-repository'
import { UpdateUserUseCase } from './update-user'
import { makeUser } from 'test/factories/make-user'
import { UserEditProps } from '@/core/types/user-props'

let inMemoryUserRepository: InMemoryUserRepository
let sut: UpdateUserUseCase

describe('Update user', () => {
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRepository()

    sut = new UpdateUserUseCase(inMemoryUserRepository)
  })

  it('should be able to edit a user', async () => {
    const newUser = makeUser()

    await inMemoryUserRepository.create(newUser)
    const user: UserEditProps = {
      firstName: 'Maria',
    }

    const result = await sut.execute({
      id: newUser.id.toString(),
      user,
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.user.firstName).toEqual('Maria')
    }
  })
})
