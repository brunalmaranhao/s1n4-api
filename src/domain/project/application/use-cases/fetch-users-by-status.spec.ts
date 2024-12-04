import { InMemoryUserRepository } from 'test/repositories/in-memory-users-repository'
import { makeUser } from 'test/factories/make-User'
import { FetchUsersByStatusUseCase } from './fetch-users-by-status'

let inMemoryUserRepository: InMemoryUserRepository
let sut: FetchUsersByStatusUseCase

describe('Fetch active Users', () => {
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRepository()
    sut = new FetchUsersByStatusUseCase(inMemoryUserRepository)
  })

  it('should be able to fetch active Users', async () => {
    const user = makeUser()

    await inMemoryUserRepository.create(user)

    const result = await sut.execute({ status: 'ACTIVE', page: 1 })

    expect(result.value?.users).toHaveLength(1)
  })
})
