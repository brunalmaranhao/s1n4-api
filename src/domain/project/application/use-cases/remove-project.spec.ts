import { InMemoryProjectRepository } from 'test/repositories/in-memory-project-repository'
import { RemoveProjectUseCase } from './remove-project'
import { makeProject } from 'test/factories/make-project'

let inMemoryProjectRepository: InMemoryProjectRepository
let sut: RemoveProjectUseCase

describe('Remove project', () => {
  beforeEach(() => {
    inMemoryProjectRepository = new InMemoryProjectRepository()

    sut = new RemoveProjectUseCase(inMemoryProjectRepository)
  })

  it('should change status to canceled when removing an active project', async () => {
    const project = makeProject()

    inMemoryProjectRepository.create(project)

    const result = await sut.execute({
      id: project.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toBeNull()
    expect(inMemoryProjectRepository.items[0].status).toBe('INACTIVE')
  })
})
