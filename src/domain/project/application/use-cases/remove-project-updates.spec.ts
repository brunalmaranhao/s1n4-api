import { InMemoryProjectUpdateRepository } from 'test/repositories/in-memory-project-updates-repository'
import { RemoveProjectUpdatesUseCase } from './remove-project-updates'
import { makeProjectUpdates } from 'test/factories/make-project-updates'

let inMemoryProjectRepository: InMemoryProjectUpdateRepository
let sut: RemoveProjectUpdatesUseCase

describe('Remove project update', () => {
  beforeEach(() => {
    inMemoryProjectRepository = new InMemoryProjectUpdateRepository()

    sut = new RemoveProjectUpdatesUseCase(inMemoryProjectRepository)
  })

  it('should change status to inactive when removing an active project update', async () => {
    const project = makeProjectUpdates()

    inMemoryProjectRepository.create(project)

    const result = await sut.execute({
      id: project.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toBeNull()
    expect(inMemoryProjectRepository.items[0].status).toBe('INACTIVE')
  })
})
