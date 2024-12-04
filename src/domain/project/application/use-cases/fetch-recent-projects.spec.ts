import { InMemoryProjectRepository } from 'test/repositories/in-memory-project-repository'
import { FetchProjectByStatusUseCase } from './fetch-project-by-status'
import { makeProject } from 'test/factories/make-project'
import { FetchRecentProjectsUseCase } from './fetch-recent-projects'

let inMemoryProjectRepository: InMemoryProjectRepository
let sut: FetchRecentProjectsUseCase

describe('Fetch recent projects', () => {
  beforeEach(() => {
    inMemoryProjectRepository = new InMemoryProjectRepository()
    sut = new FetchRecentProjectsUseCase(inMemoryProjectRepository)
  })

  it('should be able to fetch recent projects', async () => {
    const projects = [
      makeProject(),
      makeProject(),
      makeProject(),
      makeProject(),
      makeProject(),
      makeProject(),
      makeProject(),
      makeProject(),
    ]

    projects.forEach((project) => inMemoryProjectRepository.create(project))

    const result = await sut.execute({
      page: 1,
    })

    expect(result.isRight()).toBe(true)
    expect(Array.isArray(result.value?.projects)).toBe(true)
    expect(result.value?.projects.length).toBe(8)
  })

  it('should handle the case with no projects', async () => {
    const result = await sut.execute({ page: 1 })

    expect(result.isRight()).toBe(true)
    expect(result.value?.projects).toEqual([])
  })
})
