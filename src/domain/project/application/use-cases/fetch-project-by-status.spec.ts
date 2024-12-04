import { InMemoryProjectRepository } from 'test/repositories/in-memory-project-repository'
import { FetchProjectByStatusUseCase } from './fetch-project-by-status'
import { makeProject } from 'test/factories/make-project'

let inMemoryProjectRepository: InMemoryProjectRepository
let sut: FetchProjectByStatusUseCase

describe('Fetch projects by status', () => {
  beforeEach(() => {
    inMemoryProjectRepository = new InMemoryProjectRepository()
    sut = new FetchProjectByStatusUseCase(inMemoryProjectRepository)
  })

  it('should be able to fetch projects by status', async () => {
    const projects = [
      makeProject({ statusProject: 'APPROVED' }),
      makeProject({ statusProject: 'APPROVED' }),
      makeProject({ statusProject: 'WAITING' }),
      makeProject({ statusProject: 'DISAPPROVED' }),
      makeProject({ statusProject: 'DONE' }),
      makeProject({ statusProject: 'DONE' }),
      makeProject({ statusProject: 'WAITING' }),
      makeProject({ statusProject: 'CANCELED' }),
    ]

    projects.forEach((project) => inMemoryProjectRepository.create(project))

    const result = await sut.execute({
      page: 1,
      statusProject: 'APPROVED',
    })

    expect(result.isRight()).toBe(true)
    expect(Array.isArray(result.value?.projects)).toBe(true)
    expect(result.value?.projects).toHaveLength(2)
    result.value?.projects.forEach((project) => {
      expect(project.statusProject).toEqual('APPROVED')
    })
  })
})
