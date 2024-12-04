import { InMemoryProjectRepository } from 'test/repositories/in-memory-project-repository'
import { makeProject } from 'test/factories/make-project'
import { FetchProjectByIdUseCase } from './fetch-project-by-id'
import { InMemoryUserRepository } from 'test/repositories/in-memory-users-repository'
import { FetchUserByIdUseCase } from './fetch-user-by-id'
import { makeUser } from 'test/factories/make-user'

let inMemoryUserRepository: InMemoryUserRepository
let sut: FetchUserByIdUseCase

describe('Fetch user by id', () => {
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRepository()
    sut = new FetchUserByIdUseCase(inMemoryUserRepository)
  })

  it('should be able to fetch a user by id', async () => {
    const user = makeUser()

    inMemoryUserRepository.create(user)

    const result = await sut.execute({
      id: user.id.toString(),
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.user.id.toString()).toEqual(user.id.toString())
    }
  })
})
