import { CreateProjectUseCase } from './create-project'
import { InMemoryProjectRepository } from 'test/repositories/in-memory-project-repository'
import { makeProject } from 'test/factories/make-project'

let inMemoryProjectRepository: InMemoryProjectRepository
let sut: CreateProjectUseCase

describe('Create new Project', () => {
  beforeEach(() => {
    inMemoryProjectRepository = new InMemoryProjectRepository()
    sut = new CreateProjectUseCase(inMemoryProjectRepository)
  })

  it('should be able to register a new Project', async () => {
    const project = makeProject()

    const result = await sut.execute({
      customerId: project.customerId.toString(),
      deadline: project.deadline || null,
      name: project.name,
    })

    expect(result.isRight()).toBe(true)
  })
})
