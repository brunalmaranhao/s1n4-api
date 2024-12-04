import { InMemoryProjectUpdateRepository } from 'test/repositories/in-memory-project-updates-repository'
import { FetchProjectUpdateByStatusUseCase } from './fetch-project-updates-by-status'
import { InMemoryUserRepository } from 'test/repositories/in-memory-users-repository'
import { makeProjectUpdates } from 'test/factories/make-project-updates'

let inMemoryProjectRepository: InMemoryProjectUpdateRepository
let inMemoryUserRepository: InMemoryUserRepository
let sut: FetchProjectUpdateByStatusUseCase

describe('Fetch projects updates by status', () => {
  beforeEach(() => {
    inMemoryProjectRepository = new InMemoryProjectUpdateRepository()
    inMemoryUserRepository = new InMemoryUserRepository()
    sut = new FetchProjectUpdateByStatusUseCase(
      inMemoryProjectRepository,
      inMemoryUserRepository,
    )
  })

  it('should be able to fetch updates  by status and customerid', async () => {
    const projectUpdates = makeProjectUpdates()

    await inMemoryProjectRepository.create(projectUpdates)

    const result = await sut.execute({
      page: 1,
      status: 'ACTIVE',
      customerId: '1',
    })
    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value?.projectUpdates).toHaveLength(1)
    }
  })
})
