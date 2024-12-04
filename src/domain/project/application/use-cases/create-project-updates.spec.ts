import { CreateProjectUseCase } from './create-project'
import { InMemoryProjectRepository } from 'test/repositories/in-memory-project-repository'
import { makeProject } from 'test/factories/make-project'
import { InMemoryProjectUpdateRepository } from 'test/repositories/in-memory-project-updates-repository'
import { CreateProjectUpdateUseCase } from './create-project-updates'
import { makeProjectUpdates } from 'test/factories/make-project-updates'

let inMemoryProjectRepository: InMemoryProjectUpdateRepository
let sut: CreateProjectUpdateUseCase

describe('Create new Project Updates', () => {
  beforeEach(() => {
    inMemoryProjectRepository = new InMemoryProjectUpdateRepository()
    sut = new CreateProjectUpdateUseCase(inMemoryProjectRepository)
  })

  it('should be able to register a new Project Update', async () => {
    const project = makeProjectUpdates()

    const result = await sut.execute({
      projectId: project.projectId.toString(),
      userId: project.userId.toString(),
      description: project.description,
    })

    expect(result.isRight()).toBe(true)
  })
})
