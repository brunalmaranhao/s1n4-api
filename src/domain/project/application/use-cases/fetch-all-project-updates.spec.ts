import { InMemoryProjectUpdateRepository } from 'test/repositories/in-memory-project-updates-repository'
import { InMemoryUserRepository } from 'test/repositories/in-memory-users-repository'
import { makeProjectUpdates } from 'test/factories/make-project-updates'
import { FetchAllProjectUpdatesUseCase } from './fetch-all-project-updates'

let inMemoryProjectRepository: InMemoryProjectUpdateRepository
let inMemoryUserRepository: InMemoryUserRepository
let sut: FetchAllProjectUpdatesUseCase

describe('Fetch all project updates', () => {
  beforeEach(() => {
    inMemoryProjectRepository = new InMemoryProjectUpdateRepository()
    inMemoryUserRepository = new InMemoryUserRepository()
    sut = new FetchAllProjectUpdatesUseCase(inMemoryProjectRepository)
  })

  it('should be able to fetch all project updates', async () => {
    const projectUpdates = makeProjectUpdates()

    await inMemoryProjectRepository.create(projectUpdates)

    const result = await sut.execute({
      page: 1,
      status: 'ACTIVE',
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value?.projectUpdates).toHaveLength(1)
    }
  })
})
