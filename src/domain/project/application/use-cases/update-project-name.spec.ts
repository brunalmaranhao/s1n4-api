import { InMemoryProjectRepository } from 'test/repositories/in-memory-project-repository'
import { makeProject } from 'test/factories/make-project'
import { UpdateProjectNameUseCase } from './update-project-name'

let inMemoryProjectRepository: InMemoryProjectRepository
let sut: UpdateProjectNameUseCase

describe('Update Project Name', () => {
  beforeEach(() => {
    inMemoryProjectRepository = new InMemoryProjectRepository()

    sut = new UpdateProjectNameUseCase(inMemoryProjectRepository)
  })

  it('should be able to edit a Project', async () => {
    const project = makeProject()

    await inMemoryProjectRepository.create(project)

    const result = await sut.execute({
      id: project.id.toString(),
      name: 'new name',
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.project.name).toEqual('new name')
    }
  })
})
