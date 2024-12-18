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
      makeProject({ status: 'ACTIVE' }),
      makeProject({ status: 'INACTIVE' }),
    ]

    projects.forEach((project) => inMemoryProjectRepository.create(project))

    const result = await sut.execute({
      status: 'ACTIVE',
    })

    expect(result.isRight()).toBe(true)
    expect(Array.isArray(result.value?.projects)).toBe(true)
    expect(result.value?.projects).toHaveLength(1)
    result.value?.projects.forEach((project) => {
      expect(project.status).toEqual('ACTIVE')
    })
  })
})
