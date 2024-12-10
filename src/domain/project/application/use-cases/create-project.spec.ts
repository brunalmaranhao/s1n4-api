import { CreateProjectUseCase } from './create-project'
import { InMemoryProjectRepository } from 'test/repositories/in-memory-project-repository'
import { makeProject } from 'test/factories/make-project'
import { InMemoryListProjectsRepository } from 'test/repositories/in-memory-list-project-repository'
import { makeListProject } from 'test/factories/make-list-project-repository'

let inMemoryProjectRepository: InMemoryProjectRepository
let inMemoryListProjectsRepository: InMemoryListProjectsRepository
let sut: CreateProjectUseCase

describe('Create new Project', () => {
  beforeEach(() => {
    inMemoryProjectRepository = new InMemoryProjectRepository()
    inMemoryListProjectsRepository = new InMemoryListProjectsRepository()
    sut = new CreateProjectUseCase(inMemoryProjectRepository)
  })

  it('should be able to register a new Project', async () => {
    const project = makeProject()
    const listProject = makeListProject({
      customerId: project.customerId,
    })
    await inMemoryListProjectsRepository.create(listProject)

    const result = await sut.execute({
      customerId: project.customerId.toString(),
      deadline: project.deadline || null,
      name: 'Nome do Projeto',
      budget: 12,
      listProjectsId: listProject.id.toString(),
    })

    expect(result.isRight()).toBe(true)
  })
})
