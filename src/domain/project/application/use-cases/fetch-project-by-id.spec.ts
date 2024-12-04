import { InMemoryProjectRepository } from 'test/repositories/in-memory-project-repository'
import { makeProject } from 'test/factories/make-project'
import { FetchProjectByIdUseCase } from './fetch-project-by-id'

let inMemoryProjectRepository: InMemoryProjectRepository
let sut: FetchProjectByIdUseCase

describe('Fetch project by id', () => {
  beforeEach(() => {
    inMemoryProjectRepository = new InMemoryProjectRepository()
    sut = new FetchProjectByIdUseCase(inMemoryProjectRepository)
  })

  it('should be able to fetch project by id', async () => {
    const project = makeProject()

    inMemoryProjectRepository.create(project)

    const result = await sut.execute({
      id: project.id.toString(),
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.project.id.toString()).toEqual(project.id.toString())
    }
  })
})
