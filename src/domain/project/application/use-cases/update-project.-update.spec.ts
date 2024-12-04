import { InMemoryProjectUpdateRepository } from 'test/repositories/in-memory-project-updates-repository'
import { UpdateProjectUpdateUseCase } from './update-project-update'
import { makeProjectUpdates } from 'test/factories/make-project-updates'

let inMemoryProjectRepository: InMemoryProjectUpdateRepository
let sut: UpdateProjectUpdateUseCase

describe('Update Project Update', () => {
  beforeEach(() => {
    inMemoryProjectRepository = new InMemoryProjectUpdateRepository()

    sut = new UpdateProjectUpdateUseCase(inMemoryProjectRepository)
  })

  it('should be able to edit a Project', async () => {
    const project = makeProjectUpdates()

    await inMemoryProjectRepository.create(project)

    const result = await sut.execute({
      id: project.id.toString(),
      description: 'New Descriptions',
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.projectUpdate.description).toEqual('New Descriptions')
    }
  })
})
